import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArticleDrawer } from '../ArticleDrawer';
import type { Article } from '../../../types/article';

const defaultProps: Parameters<typeof ArticleDrawer>[0] = {
  isOpen: true,
  mode: 'create',
  article: null,
  onClose: vi.fn(),
  onSave: vi.fn(),
  onUpdate: vi.fn(),
  onEditClick: vi.fn(),
};

function renderDrawer(overrides: Partial<Parameters<typeof ArticleDrawer>[0]> = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<ArticleDrawer {...props} />);
}

/** Focus then immediately blur a field to mark it as touched. */
async function touchField(element: HTMLElement) {
  const user = userEvent.setup();
  await user.click(element);
  await user.tab();
}

describe('ArticleDrawer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    defaultProps.onClose = vi.fn();
    defaultProps.onSave = vi.fn();
    defaultProps.onUpdate = vi.fn();
    defaultProps.onEditClick = vi.fn();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderDrawer();

    // Touch all fields to trigger validation display
    await touchField(screen.getByPlaceholderText('Article headline'));
    await touchField(screen.getByPlaceholderText('Author name'));
    await touchField(screen.getByPlaceholderText('Article content...'));
    await touchField(document.querySelector('input[name="publicationDate"]')!);

    expect(screen.getByText('Headline is required')).toBeInTheDocument();
    expect(screen.getByText('Author is required')).toBeInTheDocument();
    expect(screen.getByText('Body is required')).toBeInTheDocument();
    expect(screen.getByText('Publication date is required')).toBeInTheDocument();
    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it('clears error when field is filled and blurred', async () => {
    const user = userEvent.setup();
    renderDrawer();

    // Touch headline to show error
    await touchField(screen.getByPlaceholderText('Article headline'));
    expect(screen.getByText('Headline is required')).toBeInTheDocument();

    // Fill headline and blur
    await user.type(screen.getByPlaceholderText('Article headline'), 'A headline');
    await user.tab();

    expect(screen.queryByText('Headline is required')).not.toBeInTheDocument();
  });

  it('shows "Author must not contain numbers" for numeric author', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await user.type(screen.getByPlaceholderText('Author name'), 'John123');
    await user.tab();

    expect(screen.getByText('Author must not contain numbers')).toBeInTheDocument();
  });

  it('shows date validation error for empty date after touch', async () => {
    renderDrawer();

    const dateInput = document.querySelector('input[name="publicationDate"]') as HTMLInputElement;
    await touchField(dateInput);

    expect(screen.getByText('Publication date is required')).toBeInTheDocument();
  });

  it('disables Save button when errors exist', () => {
    renderDrawer();

    // Form starts empty so all fields have errors
    const saveBtn = screen.getByRole('button', { name: /save/i });
    expect(saveBtn).toBeDisabled();
  });

  it('calls onSave with valid data and closes drawer', async () => {
    const user = userEvent.setup();
    renderDrawer();

    await user.type(screen.getByPlaceholderText('Article headline'), 'Test Headline');
    await user.type(screen.getByPlaceholderText('Author name'), 'Jane Doe');
    await user.type(screen.getByPlaceholderText('Article content...'), 'Some body text');

    // For date input type="date", set value natively then dispatch input event
    const dateInput = document.querySelector<HTMLInputElement>('input[name="publicationDate"]')!;
    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      nativeSetter.call(dateInput, '2025-06-01');
      dateInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Button should now be enabled
    const saveBtn = screen.getByRole('button', { name: /save/i });
    expect(saveBtn).toBeEnabled();

    // Use fireEvent.click to bypass any CSS pointer-events issues
    fireEvent.click(saveBtn);

    expect(defaultProps.onSave).toHaveBeenCalledWith({
      headline: 'Test Headline',
      author: 'Jane Doe',
      body: 'Some body text',
      publicationDate: '2025-06-01',
      published: false,
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('edit mode pre-fills form without errors', () => {
    const article: Article = {
      id: '42',
      headline: 'Existing',
      author: 'Author',
      body: 'Body text',
      publicationDate: '2025-03-01',
      published: true,
    };

    renderDrawer({ mode: 'edit', article });

    expect(screen.getByDisplayValue('Existing')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Author')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Body text')).toBeInTheDocument();

    // No validation errors should be visible
    expect(screen.queryByText('Headline is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Author is required')).not.toBeInTheDocument();

    // Update button should be enabled since all fields are valid
    const updateBtn = screen.getByRole('button', { name: /update/i });
    expect(updateBtn).not.toBeDisabled();
  });
});
