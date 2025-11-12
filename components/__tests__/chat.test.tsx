import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Chat } from '../chat';
import { useAuth } from '@/components/context/auth-context';

// Mock the useAuth hook
jest.mock('@/components/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

// Mock react-markdown and its dependencies
jest.mock('react-markdown', () => (props) => {
  return React.createElement(React.Fragment, null, props.children);
});
jest.mock('remark-gfm', () => () => {});
jest.mock('rehype-highlight', () => () => {});

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        choices: [{ message: { content: 'Hello there!' } }],
      }),
    body: {
      getReader: () => ({
        read: () => Promise.resolve({ done: true }),
        releaseLock: () => {},
      }),
    },
  })
) as jest.Mock;

describe('Chat component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      backendData: { chatHistory: [] },
      loading: false,
    });
    (fetch as jest.Mock).mockClear();
  });

  it('sends the full chat history to the API', async () => {
    render(<Chat level="Beginner" selectedGrammar={null} selectedWord={null} />);

    // User types and sends first message
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'Hello' },
    });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    // User types and sends second message
    fireEvent.change(screen.getByPlaceholderText('Type your message...'), {
      target: { value: 'How are you?' },
    });
    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[1][1].body);

    expect(fetchBody.messages).toHaveLength(4);
    expect(fetchBody.stream).toBe(true); // Check that streaming is enabled
    expect(fetchBody.messages[0].role).toBe('assistant');
    expect(fetchBody.messages[0].content).toBe('안녕하세요! 한국어 학습을 도와드리겠습니다. 궁금한 것이 있으면 언제든 물어보세요! 👋');
    expect(fetchBody.messages[1].role).toBe('user');
    expect(fetchBody.messages[1].content).toBe('Hello');
    expect(fetchBody.messages[2].role).toBe('assistant');
    expect(fetchBody.messages[2].content).toBe('Hello there!');
    expect(fetchBody.messages[3].role).toBe('user');
    expect(fetchBody.messages[3].content).toBe('How are you?');
  });
});