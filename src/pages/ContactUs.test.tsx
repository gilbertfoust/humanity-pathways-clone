import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactUs from "@/pages/ContactUs";

const invokeMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: (...args: unknown[]) => invokeMock(...args) },
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <ContactUs />
    </MemoryRouter>
  );

describe("ContactUs form", () => {
  beforeEach(() => invokeMock.mockReset());

  const fill = () => {
    fireEvent.change(screen.getByPlaceholderText("Your Name *"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByPlaceholderText("Email Address *"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Subject *"), { target: { value: "Partnership" } });
    fireEvent.change(screen.getByPlaceholderText("Your Message *"), {
      target: { value: "Hello, I'd like to talk about a partnership." },
    });
  };

  it("shows success state with reference ID after a successful submit", async () => {
    invokeMock.mockResolvedValueOnce({
      data: { success: true, referenceId: "HPG-C-ABC001" },
      error: null,
    });
    renderPage();
    fill();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/message received/i)).toBeInTheDocument();
    expect(screen.getByText(/HPG-C-ABC001/)).toBeInTheDocument();
  });

  it("shows an error banner when the edge function fails", async () => {
    invokeMock.mockResolvedValueOnce({
      data: { success: false, error: "Server error" },
      error: null,
    });
    renderPage();
    fill();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    const alerts = await screen.findAllByRole("alert");
    expect(alerts.some((n) => n.textContent?.includes("Server error"))).toBe(true);
  });

  it("blocks submission with client-side validation errors", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(invokeMock).not.toHaveBeenCalled();
  });
});
