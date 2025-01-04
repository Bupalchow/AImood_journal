import { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export function MistralKeyModal({ onClose, isOpen }: Props) {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('user_mistral_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('user_mistral_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('user_mistral_api_key');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Mistral API Configuration</h3>
        <p className="text-gray-600 mb-4">
          There has been a API overload, You can use your own Mistral API key for better reliability. This is optional - if you don't provide a key, the default key will be used.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Mistral API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Optional: Enter your Mistral API key"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
