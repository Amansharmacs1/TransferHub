import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DragDropZone from '../DragDropZone';

describe('DragDropZone Component', () => {
  it('renders the drag drop zone text', () => {
    render(<DragDropZone onFilesSelected={() => {}} />);
    expect(screen.getByText(/Drag & Drop Files or Folders/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Files/i)).toBeInTheDocument();
  });

  it('triggers onFilesSelected when a file is selected via input', () => {
    const handleFilesSelected = vi.fn();
    render(<DragDropZone onFilesSelected={handleFilesSelected} />);
    
    // Create a dummy file
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');
    
    // Simulate user selecting a file
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(handleFilesSelected).toHaveBeenCalledTimes(1);
    expect(handleFilesSelected).toHaveBeenCalledWith(expect.any(Object));
  });
});
