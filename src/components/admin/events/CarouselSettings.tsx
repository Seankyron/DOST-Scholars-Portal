'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function CarouselSettings() {
    const [timer, setTimer] = useState('5 seconds');
    const [effect, setEffect] = useState('Slide');
    const [settings, setSettings] = useState({
        showDots: false,
        showArrows: false,
        infiniteLoop: false,
        pauseOnHover: false,
    });

    const handleSave = () => {
        alert('Settings saved!');
    };

    const timerOptions = [
        { label: '3 seconds', value: '3 seconds' },
        { label: '5 seconds', value: '5 seconds' },
        { label: '10 seconds', value: '10 seconds' },
    ];

    const effectOptions = [
        { label: 'Slide', value: 'Slide' },
        { label: 'Fade', value: 'Fade' },
    ];

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Carousel Settings</h2>

            <div className="space-y-3">
                <div>
                    <Label>Auto-advance Timer</Label>
                    <Select
                    value={timer}
                    onChange={(e) => setTimer(e.target.value)} 
                    options={timerOptions}
                    placeholder="Select timer"
                    />
                </div>

                <div>
                    <Label>Transition Effect</Label>
                    <Select
                    value={effect}
                    onChange={(e) => setEffect(e.target.value)}
                    options={effectOptions}
                    placeholder="Select effect"
                    />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <Label className="flex justify-between">
                        Show Navigation Dots
                        <Switch
                            checked={settings.showDots}
                            onCheckedChange={(val: boolean) => setSettings({ ...settings, showDots: val })}
                        />
                    </Label>
                    <Label className="flex justify-between">
                        Show Arrow Controls
                        <Switch
                            checked={settings.showArrows}
                            onCheckedChange={(val: boolean) => setSettings({ ...settings, showArrows: val })}
                        />
                    </Label>
                    <Label className="flex justify-between">
                        Infinite Loop
                        <Switch
                            checked={settings.infiniteLoop}
                            onCheckedChange={(val: boolean) => setSettings({ ...settings, infiniteLoop: val })}
                        />
                    </Label>
                    <Label className="flex justify-between">
                        Pause on Hover
                        <Switch
                            checked={settings.pauseOnHover}
                            onCheckedChange={(val: boolean) => setSettings({ ...settings, pauseOnHover: val })}
                        />
                    </Label>
                </div>

                <Button onClick={handleSave} className="w-full mt-4">
                    Save Changes
                </Button>
            </div>
        </div>
    );
}