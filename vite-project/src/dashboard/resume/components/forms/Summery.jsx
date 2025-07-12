import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from './../../../../../service/AIModal';

// Fixed Prompt
const prompt = `Job Title: {jobTitle}, 
Based on the job title, give a list of summaries for 3 experience levels: 
1. Fresher, 
2. Mid-Level, 
3. Senior Level. 
Each summary should be 3-4 lines.
Return in JSON array format with "summary" and "experience_level" fields.`;

function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);
  const params = useParams();

  useEffect(() => {
    if (resumeInfo?.summery && !summery) {
      setSummery(resumeInfo.summery);
    }
  }, [resumeInfo]);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      summery: summery,
    }));
  }, [summery]);

  const GenerateSummeryFromAI = async () => {
    try {
      setLoading(true);
      const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle || 'Software Developer');
      console.log('Prompt:', PROMPT);

      const result = await AIChatSession.sendMessage(PROMPT);
      const text = await result.response.text(); // await the text
      console.log('AI raw response:', text);

      const cleanedText = text.trim();
      const jsonStart = cleanedText.indexOf('[');
      const jsonEnd = cleanedText.lastIndexOf(']');
      const jsonString = cleanedText.slice(jsonStart, jsonEnd + 1);

      const parsed = JSON.parse(jsonString);

      setAiGenerateSummeryList(parsed);
    } catch (error) {
      console.error('Error generating summary from AI:', error);
      toast.error('Failed to generate summary. Please try again.');
      setAiGenerateSummeryList([]);
    } finally {
      setLoading(false);
    }
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      data: {
        summery: summery,
      },
    };

    GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(
      (resp) => {
        console.log(resp);
        enabledNext(true);
        setLoading(false);
        toast('Details updated');
      },
      (error) => {
        console.error(error);
        setLoading(false);
        toast.error("Couldn't save the summary");
      }
    );
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add a summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              variant="outline"
              onClick={GenerateSummeryFromAI}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
              disabled={loading}
            >
              <Brain className="h-4 w-4" /> Generate from AI
            </Button>
          </div>

          <Textarea
            className="mt-5"
            required
            value={summery ?? resumeInfo?.summery ?? ''}
            onChange={(e) => setSummery(e.target.value)}
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>

      {/* AI Suggested Summaries */}
      {Array.isArray(aiGeneratedSummeryList) && aiGeneratedSummeryList.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummeryList.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummery(item?.summary)}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer transition duration-200 hover:bg-primary/10"
            >
              <h2 className="font-bold my-1 text-primary">Level: {item?.experience_level}</h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summery;
