import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  closeSaveModal,
  setSaveModalFilename,
  setSaveModalStatus,
  setSaveModalError,
} from '@/store/slices';

export function SaveJsonModal() {
  const dispatch = useAppDispatch();
  const { isOpen, filename, status, error } = useAppSelector(state => state.app.saveModal);
  const resumeData = useAppSelector(state => state.app.resumeData);

  const handleSave = async () => {
    if (!filename.trim()) {
      dispatch(setSaveModalError('Please enter a filename'));
      return;
    }

    if (!resumeData) {
      dispatch(setSaveModalError('No resume data to save'));
      return;
    }

    dispatch(setSaveModalStatus('saving'));
    dispatch(setSaveModalError(''));

    try {
      await axios.post('/api/json-files', {
        filename: filename.trim(),
        data: resumeData,
      });

      dispatch(setSaveModalStatus('success'));
      setTimeout(() => {
        dispatch(closeSaveModal());
      }, 1500);
    } catch (err) {
      console.error('Error saving file:', err);
      dispatch(setSaveModalError('Failed to save file'));
      dispatch(setSaveModalStatus('error'));
    }
  };

  const handleClose = () => {
    if (status !== 'saving') {
      dispatch(closeSaveModal());
    }
  };

  const handleFilenameChange = (value: string) => {
    dispatch(setSaveModalFilename(value));
  };

  if (!isOpen) return null;

  const saving = status === 'saving';
  const success = status === 'success';

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className='w-full max-w-md rounded-2xl border-2 border-violet-200 bg-white p-6 shadow-2xl'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 p-2 shadow-md'>
              <svg className='h-6 w-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
                />
              </svg>
            </div>
            <h2 className='text-xl font-bold text-gray-800'>Save JSON Data</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={saving}
            className='rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed'
          >
            <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {error && (
          <div className='mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        {success && (
          <div className='mb-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700'>
            File saved successfully!
          </div>
        )}

        <div className='mb-6'>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Filename</label>
          <input
            type='text'
            value={filename}
            onChange={(e) => handleFilenameChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            disabled={saving}
            placeholder='my-resume'
            className='w-full rounded-lg border-2 border-gray-200 px-4 py-3 font-medium text-gray-700 transition-all duration-200 placeholder:text-gray-400 hover:border-violet-300 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50'
          />
          <p className='mt-2 text-xs text-gray-500'>.json extension will be added automatically</p>
        </div>

        <div className='flex gap-3'>
          <button
            onClick={handleClose}
            disabled={saving}
            className='flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !filename.trim()}
            className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50'
          >
            {saving ? (
              <>
                <svg className='h-5 w-5 animate-spin' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}