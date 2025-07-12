import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import {
  BtnBold, BtnBulletList, BtnItalic, BtnLink,
  BtnNumberedList, BtnStrikeThrough, BtnUnderline,
  Editor, EditorProvider, Separator, Toolbar
} from 'react-simple-wysiwyg';
import { AIChatSession } from './../../../../service/AIModal';
import { toast } from 'sonner';

// Strict prompt for AI - significantly improved to prevent complex JSON structures
const PROMPT = `
Position title: {positionTitle}

Generate 5-7 professional bullet points for a resume describing experience for this position.

IMPORTANT FORMATTING INSTRUCTIONS:
- ONLY return HTML format with a <ul> containing <li> elements
- DO NOT return ANY JSON data structures
- DO NOT include any text outside the <ul> tags
- DO NOT include any nested objects, arrays, or data structures
- DO NOT include any metadata or explanations
- DO NOT include any quotes, braces or brackets

Example of expected format:
<ul>
<li>First bullet point about the position</li>
<li>Second bullet point about the position</li>
</ul>

Return the HTML list directly without any markdown formatting, JSON structure, or explanation.
`;

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue || '');
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  // Sync with defaultValue changes
  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const generateSummaryFromAI = async () => {
    // Validate that we have a position title
    if (!resumeInfo?.Experience?.[index]?.title) {
      toast.error('Please add a Position Title first');
      return;
    }
    
    setLoading(true);
    
    try {
      // Replace the placeholder with the actual position title
      const prompt = PROMPT.replace('{positionTitle}', resumeInfo.Experience[index].title);
      
      // Send the prompt to the AI service
      const result = await AIChatSession.sendMessage(prompt);
      
      if (!result || !result.response) {
        throw new Error('Invalid response from AI service');
      }
      
      // Get the response text
      const responseText = await result.response.text();
      let cleanResponse = responseText.trim();
      console.log('Raw AI response:', cleanResponse);
      
      // Process the response - handle various formats
      let bulletPoints = [];
      
      // Check if response is JSON
      if (cleanResponse.startsWith('{') || cleanResponse.startsWith('[')) {
        try {
          // Parse the JSON response
          const jsonData = JSON.parse(cleanResponse);
          
          // Handle deeply nested format: {"experience": [{"title": "...", "points": ["..."]}]}
          if (Array.isArray(jsonData.experience) && jsonData.experience.length > 0) {
            // Check if the experience array contains objects with points arrays
            if (jsonData.experience[0] && Array.isArray(jsonData.experience[0].points)) {
              bulletPoints = jsonData.experience[0].points;
            } 
            // Check if the experience array contains strings directly
            else if (typeof jsonData.experience[0] === 'string') {
              bulletPoints = jsonData.experience;
            }
          } 
          // Handle simple array
          else if (Array.isArray(jsonData)) {
            bulletPoints = jsonData;
          }
          // Handle object with bullet_points property
          else if (jsonData.bullet_points) {
            if (Array.isArray(jsonData.bullet_points)) {
              bulletPoints = jsonData.bullet_points;
            } else if (typeof jsonData.bullet_points === 'string') {
              bulletPoints = jsonData.bullet_points.split(/[\n.]+/).filter(Boolean);
            }
          }
          // Handle any array property found in the object
          else {
            // Recursively search for arrays in the JSON object
            const findArrays = (obj) => {
              if (!obj || typeof obj !== 'object') return [];
              
              // Check each property
              for (const key in obj) {
                if (Array.isArray(obj[key]) && obj[key].length > 0) {
                  // If it's an array of strings, use it directly
                  if (typeof obj[key][0] === 'string') {
                    return obj[key];
                  } 
                  // If it's an array of objects with 'points' property
                  else if (obj[key][0] && Array.isArray(obj[key][0].points)) {
                    return obj[key][0].points;
                  }
                  // If it's just an array of objects, look deeper
                  else if (obj[key][0] && typeof obj[key][0] === 'object') {
                    for (const innerKey in obj[key][0]) {
                      if (Array.isArray(obj[key][0][innerKey])) {
                        return obj[key][0][innerKey];
                      }
                    }
                  }
                } 
                // Recursively search nested objects
                else if (obj[key] && typeof obj[key] === 'object') {
                  const result = findArrays(obj[key]);
                  if (result.length > 0) return result;
                }
              }
              return [];
            };
            
            bulletPoints = findArrays(jsonData);
          }
          
          // If we found bullet points, convert them to HTML
          if (bulletPoints.length > 0) {
            cleanResponse = `<ul>${bulletPoints.map(point => `<li>${point.trim()}</li>`).join('')}</ul>`;
          } else {
            // Fallback to using JSON.stringify for debugging
            console.error('Could not extract bullet points from JSON:', jsonData);
            throw new Error('Could not extract bullet points from AI response');
          }
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError, cleanResponse);
          // Fallback to plain text handling
          const lines = cleanResponse
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/^[-•*]\s*/, ''));
          
          cleanResponse = `<ul>${lines.map(line => `<li>${line}</li>`).join('')}</ul>`;
        }
      } else if (cleanResponse.includes('<ul>') && cleanResponse.includes('</ul>')) {
        // Response already contains a properly formatted list
        // Just make sure it's clean
        const ulStartIndex = cleanResponse.indexOf('<ul>');
        const ulEndIndex = cleanResponse.lastIndexOf('</ul>') + 5;
        cleanResponse = cleanResponse.substring(ulStartIndex, ulEndIndex);
      } else {
        // Format plain text response as a bullet list
        const lines = cleanResponse
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => line.replace(/^[-•*]\s*/, '')); // Remove bullet chars if present
        
        cleanResponse = `<ul>${lines.map(line => `<li>${line}</li>`).join('')}</ul>`;
      }
      
      // Update the state and call the onChange handler
      setValue(cleanResponse);
      if (typeof onRichTextEditorChange === 'function') {
        onRichTextEditorChange(cleanResponse, 'workSummery', index);
      }
      
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (typeof onRichTextEditorChange === 'function') {
      // Pass parameters in the correct order that Experience.jsx expects
      onRichTextEditorChange(newValue, 'workSummery', index);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={generateSummaryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor value={value} onChange={handleEditorChange}>
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;

