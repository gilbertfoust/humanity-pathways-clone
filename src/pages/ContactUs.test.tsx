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
      data: {
        success: true,
        referenceId: "HPG-C-ABC001",
        queued: { notification: true, acknowledgement: true },
      },
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

  it("surfaces a 502 when the acknowledgement email fails to queue", async () => {
    invokeMock.mockResolvedValueOnce({
      data: {
        success: false,
        referenceId: "HPG-C-FAILAK",
        error:
          "Your message was saved but the acknowledgement email could not be queued. Please save your reference number.",
        queued: { notification: true, acknowledgement: false },
      },
      error: null,
    });
    renderPage();
    fill();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    const alerts = await screen.findAllByRole("alert");
    expect(
      alerts.some((n) => /acknowledgement email could not be queued/i.test(n.textContent || ""))
    ).toBe(true);
    // must NOT show success state
    expect(screen.queryByText(/message received/i)).not.toBeInTheDocument();
  });

  it("reuses the same idempotency key across retries in the same session", async () => {
    invokeMock.mockResolvedValueOnce({
      data: { success: false, error: "Network blip" },
      error: null,
    });
    invokeMock.mockResolvedValueOnce({
      data: {
        success: true,
        referenceId: "HPG-C-RETRY1",
        duplicate: true,
        queued: { notification: true, acknowledgement: true },
      },
      error: null,
    });
    renderPage();
    fill();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalledTimes(2));
    const firstKey = (invokeMock.mock.calls[0][1] as { body: { idempotencyKey: string } }).body
      .idempotencyKey;
    const secondKey = (invokeMock.mock.calls[1][1] as { body: { idempotencyKey: string } }).body
      .idempotencyKey;
    expect(firstKey).toBe(secondKey);
    expect(await screen.findByText(/message received/i)).toBeInTheDocument();
  });

  it("blocks submission with client-side validation errors", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(invokeMock).not.toHaveBeenCalled();
  });
});
