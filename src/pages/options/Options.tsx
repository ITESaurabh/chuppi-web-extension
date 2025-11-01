import { useEffect, useState } from 'react';
import '@pages/options/Options.css';
import { SettingsService, AutoMuteSettings } from '../../services/settings';

export default function Options() {
  const [settings, setSettings] = useState<AutoMuteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await SettingsService.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      setMessage('Error loading settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    setMessage('');

    try {
      await SettingsService.saveSettings(settings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof AutoMuteSettings) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handlePlatformToggle = (platform: keyof AutoMuteSettings['platforms']) => {
    if (!settings) return;
    setSettings({
      ...settings,
      platforms: {
        ...settings.platforms,
        [platform]: {
          enabled: !settings.platforms[platform]?.enabled,
        },
      },
    });
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to default?')) {
      return;
    }

    setSaving(true);
    try {
      await SettingsService.resetSettings();
      await loadSettings();
      setMessage('Settings reset to default');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error resetting settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="error">Failed to load settings</div>;
  }

  return (
    <div className="options-container">
      <h1>🤫 Chuppi - Auto Mute Settings</h1>
      
      <div className="settings-section">
        <h2>General Settings</h2>
        
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={() => handleToggle('enabled')}
            />
            <span>Enable Auto-Mute</span>
          </label>
          <p className="setting-description">
            Automatically mute microphone and camera when joining a meeting for the first time
          </p>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.muteMic}
              onChange={() => handleToggle('muteMic')}
              disabled={!settings.enabled}
            />
            <span>Mute Microphone</span>
          </label>
          <p className="setting-description">
            Automatically mute your microphone
          </p>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.muteCamera}
              onChange={() => handleToggle('muteCamera')}
              disabled={!settings.enabled}
            />
            <span>Disable Camera</span>
          </label>
          <p className="setting-description">
            Automatically turn off your camera
          </p>
        </div>
      </div>

      <div className="settings-section">
        <h2>Platform Settings</h2>
        <p className="section-description">
          Enable or disable auto-mute for specific platforms
        </p>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.platforms['google-meet']?.enabled ?? false}
              onChange={() => handlePlatformToggle('google-meet')}
              disabled={!settings.enabled}
            />
            <span>Google Meet</span>
          </label>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.platforms['zoom']?.enabled ?? false}
              onChange={() => handlePlatformToggle('zoom')}
              disabled={!settings.enabled}
            />
            <span>Zoom</span>
          </label>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.platforms['microsoft-teams']?.enabled ?? false}
              onChange={() => handlePlatformToggle('microsoft-teams')}
              disabled={!settings.enabled}
            />
            <span>Microsoft Teams</span>
          </label>
        </div>
      </div>

      <div className="button-group">
        <button 
          className="save-button" 
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        
        <button 
          className="reset-button" 
          onClick={handleReset}
          disabled={saving}
        >
          Reset to Default
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="info-section">
        <h3>How it works</h3>
        <ul>
          <li>Auto-mute activates only on your <strong>first join</strong> to a meeting</li>
          <li>After that, you can freely toggle your mic and camera as needed</li>
          <li>Each new meeting session will auto-mute again (if enabled)</li>
          <li>Settings are saved locally and sync across all your meetings</li>
        </ul>
      </div>
    </div>
  );
}
