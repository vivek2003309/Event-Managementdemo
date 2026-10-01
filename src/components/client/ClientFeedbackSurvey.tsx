import React, { useState } from 'react';
import { Star, Sparkles, Send, CheckCircle2, Award } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface ClientFeedbackSurveyProps {
  wedding: any;
  onUpdateWedding?: (updated: any) => void;
}

export const ClientFeedbackSurvey: React.FC<ClientFeedbackSurveyProps> = ({ wedding, onUpdateWedding }) => {
  const { addToast } = useToast();
  const existingFeedback = wedding?.postWeddingFeedback || null;

  const [ratings, setRatings] = useState({
    planning: existingFeedback?.ratings?.planning || 5,
    scenography: existingFeedback?.ratings?.scenography || 5,
    logistics: existingFeedback?.ratings?.logistics || 5,
    hospitality: existingFeedback?.ratings?.hospitality || 5,
    overall: existingFeedback?.ratings?.overall || 5,
  });

  const [comments, setComments] = useState({
    planning: existingFeedback?.comments?.planning || '',
    scenography: existingFeedback?.comments?.scenography || '',
    logistics: existingFeedback?.comments?.logistics || '',
    hospitality: existingFeedback?.comments?.hospitality || '',
    testimonial: existingFeedback?.testimonial || '',
  });

  const [submitted, setSubmitted] = useState(!!existingFeedback);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (category: keyof typeof ratings, score: number) => {
    setRatings((prev) => ({ ...prev, [category]: score }));
  };

  const handleCommentChange = (category: keyof typeof comments, text: string) => {
    setComments((prev) => ({ ...prev, [category]: text }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const feedbackPayload = {
        ratings,
        comments,
        testimonial: comments.testimonial,
        submittedAt: new Date().toISOString(),
      };

      const updatedWedding = {
        ...wedding,
        postWeddingFeedback: feedbackPayload,
      };

      // Save to localStorage managed_weddings
      const managedRaw = localStorage.getItem('managed_weddings') || localStorage.getItem('wedding_managed_projects');
      if (managedRaw) {
        const parsed: any[] = JSON.parse(managedRaw);
        const updatedList = parsed.map((w) => (w.id === wedding.id || w.clientName === wedding.clientName ? updatedWedding : w));
        localStorage.setItem('managed_weddings', JSON.stringify(updatedList));
        localStorage.setItem('wedding_managed_projects', JSON.stringify(updatedList));
        window.dispatchEvent(new Event('managed_weddings_updated'));
      }

      if (onUpdateWedding) {
        onUpdateWedding(updatedWedding);
      }

      setSubmitted(true);
      addToast({
        type: 'success',
        title: 'Feedback Submitted',
        message: 'Your private post-wedding evaluation has been saved for the atelier director.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Could not save feedback response.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { key: 'planning', label: 'Planning & Directorial Coordination', desc: 'Run-of-show orchestration and timeline management' },
    { key: 'scenography', label: 'Couture Scenography & Floral Decor', desc: 'Architectural mandaps, lighting, and thematic design' },
    { key: 'logistics', label: 'Production Logistics & AV', desc: 'Sound, staging, pyrotechnics, and artist management' },
    { key: 'hospitality', label: 'Hospitality & Guest Curation', desc: 'Concierge services, butler care, and hotel management' },
    { key: 'overall', label: 'Overall Atelier Experience', desc: 'Single-point directorial command and partnership' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#171717] text-white p-6 sm:p-8 rounded-[12px] relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-[#C6A66B]">
            <Award className="w-5 h-5" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">Post-Wedding Evaluation</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal">
            Atelier Experience Survey
          </h1>
          <p className="text-[13px] text-white/80 font-light max-w-2xl leading-relaxed">
            Your evaluation allows our directors to uphold the pinnacle of architectural scenography and bespoke hospitality. All responses are saved privately to your commission dossier.
          </p>
        </div>
      </div>

      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-[8px] flex items-center gap-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h3 className="text-[14px] font-semibold text-emerald-900">Evaluation Submitted Successfully</h3>
            <p className="text-[12px] text-emerald-700">
              Thank you for sharing your feedback. The atelier director has received your ratings and testimonial.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="ml-auto px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 text-[11px] font-medium rounded hover:bg-emerald-100 cursor-pointer"
          >
            Edit Responses
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-[12px] border border-[#EAE5DC] shadow-xs space-y-8">
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.key} className="p-4 sm:p-5 rounded-[8px] bg-[#FAF8F5] border border-[#EAE5DC] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-[14px] font-medium text-[#171717]">{cat.label}</h3>
                  <p className="text-[11px] text-[#77736D]">{cat.desc}</p>
                </div>
                {/* Star Rating */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={submitted && !isSubmitting}
                      onClick={() => handleRatingChange(cat.key as any, star)}
                      className="p-1 focus:outline-none cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= (ratings as any)[cat.key]
                            ? 'fill-[#C6A66B] text-[#C6A66B]'
                            : 'text-[#D6CEBE]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono text-[12px] font-semibold text-[#171717] ml-2">
                    {(ratings as any)[cat.key]}/5
                  </span>
                </div>
              </div>

              {cat.key !== 'overall' && (
                <div>
                  <input
                    type="text"
                    disabled={submitted && !isSubmitting}
                    placeholder={`Optional comments on ${cat.label.toLowerCase()}...`}
                    value={(comments as any)[cat.key]}
                    onChange={(e) => handleCommentChange(cat.key as any, e.target.value)}
                    className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Testimonial & Private Review */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77736D] block">
            Private Testimonial & Director Note
          </label>
          <textarea
            rows={4}
            disabled={submitted && !isSubmitting}
            placeholder="Share your thoughts on working with The Wedding Dreams atelier..."
            value={comments.testimonial}
            onChange={(e) => handleCommentChange('testimonial', e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#D6CEBE] text-[13px] p-3 rounded-[6px] focus:outline-none focus:border-[#C6A66B] leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-[#EAE5DC] flex items-center justify-between">
          <span className="text-[11px] text-[#9C968C]">
            Responses are securely encrypted & stored in your commission record.
          </span>
          <button
            type="submit"
            disabled={isSubmitting || (submitted && !isSubmitting)}
            className="px-6 py-2.5 rounded-[6px] bg-[#171717] hover:bg-[#C6A66B] text-white text-[12px] font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-[#C6A66B]" />
            <span>{isSubmitting ? 'Saving Survey...' : submitted ? 'Survey Saved' : 'Submit Private Evaluation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
