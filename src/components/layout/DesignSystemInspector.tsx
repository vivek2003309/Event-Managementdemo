import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Slider } from '../ui/Slider';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { Sparkles, Check, Palette, Layers, Type, Sliders } from 'lucide-react';
import { DESIGN_TOKENS, formatINR } from '../../lib/designSystem';

export const DesignSystemInspector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');
  const [testSlider, setTestSlider] = useState(350);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const { addToast } = useToast();

  const colorPalettes = [
    { name: 'Warm Ivory (Canvas)', hex: '#F8F5EF', text: '#171717', border: true },
    { name: 'Pure White (Alabaster)', hex: '#FFFFFF', text: '#171717', border: true },
    { name: 'Champagne Gold (Accent)', hex: '#C6A66B', text: '#FFFFFF' },
    { name: 'Dusty Rose (Ceremonial)', hex: '#C9A7A1', text: '#171717' },
    { name: 'Deep Charcoal (Primary)', hex: '#171717', text: '#F8F5EF' },
    { name: 'Charcoal Text', hex: '#252525', text: '#F8F5EF' },
    { name: 'Muted Text', hex: '#77736D', text: '#FFFFFF' },
    { name: 'Stone Hairline Border', hex: '#EAE5DC', text: '#171717', border: true },
  ];

  return (
    <>
      {/* Floating Design System Verification Trigger */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[4px] bg-white border border-[#EAE5DC] text-[11px] font-medium uppercase tracking-[0.14em] text-[#171717] hover:border-[#C6A66B] hover:shadow-md transition-all shadow-xs cursor-pointer"
        >
          <Palette className="w-3.5 h-3.5 text-[#C6A66B]" />
          <span>Design System Inspector</span>
        </button>
      </div>

      {/* Verification Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="The Wedding Dreams Design System"
        subtitle="Verification & Tokens Console"
        maxWidth="4xl"
      >
        <div className="space-y-6">
          <p className="text-[13px] text-[#77736D]">
            Inspect all color tokens, typography rules, interactive component variants, and accessibility invariants defined in the design brief.
          </p>

          {/* Navigation Tabs */}
          <Tabs
            items={[
              { id: 'colors', label: 'Color Tokens' },
              { id: 'typography', label: 'Typography' },
              { id: 'buttons', label: 'Buttons & Forms' },
              { id: 'states', label: 'Feedback & States' },
            ]}
            activeId={activeTab}
            onChange={setActiveTab}
          />

          {/* 1. Colors Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <h4 className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
                Core Brand Tokens (60-30-10 Balanced)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colorPalettes.map((c) => (
                  <div
                    key={c.name}
                    className="p-3.5 rounded-[6px] flex flex-col justify-between h-24 shadow-xs"
                    style={{
                      backgroundColor: c.hex,
                      color: c.text,
                      border: c.border ? '1px solid #EAE5DC' : 'none',
                    }}
                  >
                    <span className="text-[11px] font-medium leading-tight">{c.name}</span>
                    <span className="font-mono text-[11px] opacity-80 uppercase">{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Typography Tab */}
          {activeTab === 'typography' && (
            <div className="space-y-5 bg-[#FCFAF6] p-6 rounded-[8px] border border-[#EAE5DC]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] block">
                  Display Large (Playfair / Cormorant)
                </span>
                <h1 className="font-serif text-[38px] text-[#171717] font-normal leading-tight">
                  Your Story. Beautifully Celebrated.
                </h1>
              </div>
              <div className="border-t border-[#EAE5DC] pt-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] block">
                  Headline Medium
                </span>
                <h3 className="font-serif text-[26px] text-[#171717] font-normal">
                  Every celebration should feel uniquely, indelibly yours.
                </h3>
              </div>
              <div className="border-t border-[#EAE5DC] pt-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A66B] block">
                  Body Typography (Manrope / Plus Jakarta Sans)
                </span>
                <p className="text-[14px] text-[#77736D] leading-relaxed max-w-2xl mt-1">
                  We deliberately discard cookie-cutter banquet formats and commercial clutter. Instead, our atelier orchestrates bespoke wedding scenography that honors both sacred rituals and your personal romance with effortless poise.
                </p>
              </div>
            </div>
          )}

          {/* 3. Buttons & Forms Tab */}
          {activeTab === 'buttons' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#77736D] block">
                  Button Hierarchy &amp; Anti-Pill 4px Radius
                </span>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button variant="primary" size="md">
                    Primary Charcoal
                  </Button>
                  <Button variant="secondary" size="md">
                    Secondary Hairline
                  </Button>
                  <Button variant="accent" size="md">
                    Accent Champagne
                  </Button>
                  <Button variant="outline" size="md">
                    Stone Outline
                  </Button>
                  <Button variant="ghost" size="md">
                    Ghost Link
                  </Button>
                  <Button variant="primary" size="md" isLoading>
                    Loading
                  </Button>
                </div>
              </div>

              <div className="space-y-3 border-t border-[#EAE5DC] pt-5">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#77736D] block">
                  Form Controls
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Bride or Groom Full Name" placeholder="e.g. Meera Singhania" />
                  <Select
                    label="Curated Enclave"
                    value="udaipur"
                    onChange={() => {}}
                    options={[
                      { value: 'udaipur', label: 'Udaipur • Lake Palaces' },
                      { value: 'jaipur', label: 'Jaipur • Royal Mansions' },
                      { value: 'goa', label: 'Goa • Coastal Estates' },
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-[#EAE5DC] pt-5">
                <Slider
                  label="Guest Count Calibrator"
                  min={100}
                  max={1000}
                  step={50}
                  value={testSlider}
                  valueDisplay={`${testSlider} Guests`}
                  onChangeValue={setTestSlider}
                />
              </div>
            </div>
          )}

          {/* 4. States & Feedback Tab */}
          {activeTab === 'states' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() =>
                    addToast({
                      type: 'success',
                      title: 'Design System Verified',
                      message: 'Tokens, radius, and typography match high-fashion editorial brief.',
                    })
                  }
                >
                  Trigger Success Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    addToast({
                      type: 'info',
                      title: 'Atelier Note',
                      message: 'Bespoke venue calendar synchronizing in real time.',
                    })
                  }
                >
                  Trigger Info Toast
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsTestModalOpen(true)}
                >
                  Open Nested Modal Dialog
                </Button>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#EAE5DC]">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#77736D] block">
                  Loading Skeleton System
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton variant="card" />
                  <div className="space-y-2.5 p-6 bg-white border border-[#EAE5DC] rounded-[8px]">
                    <Skeleton variant="text" className="h-5 w-3/4" />
                    <Skeleton variant="text" className="h-3 w-full" />
                    <Skeleton variant="text" className="h-3 w-5/6" />
                    <Skeleton variant="text" className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Nested test dialog */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title="Interactive Verification Modal"
        subtitle="Dialogue Mechanics"
        maxWidth="md"
      >
        <p className="text-[13px] text-[#77736D] leading-relaxed">
          Modal incorporates focus management, escape key dismissal, and backdrop blur with accessible dialog attributes.
        </p>
        <div className="pt-4 flex justify-end">
          <Button variant="primary" size="sm" onClick={() => setIsTestModalOpen(false)}>
            Close Verification
          </Button>
        </div>
      </Modal>
    </>
  );
};
