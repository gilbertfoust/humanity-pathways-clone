import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BoardApplication from "@/pages/BoardApplication";

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
      <BoardApplication />
    </MemoryRouter>
  );

const fillValid = () => {
  fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: "Alex Rivera" } });
  fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: "alex@example.com" } });
  fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: "555-0100" } });
  fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: "Chicago, IL" } });
  fireEvent.change(screen.getByLabelText(/Seat/i), { target: { value: "Director" } });
  fireEvent.change(screen.getByLabelText(/Professional background/i), {
    target: { value: "Twenty plus years in nonprofit governance and finance." },
  });
  fireEvent.change(screen.getByLabelText(/^Motivation/i), {
    target: { value: "Committed to advancing HPG's global mission and governance." },
  });
  fireEvent.click(screen.getByLabelText(/I confirm/i));
};

describe("BoardApplication form", () => {
  beforeEach(() => invokeMock.mockReset());

  it("shows success only after both notification and acknowledgement are queued", async () => {
    invokeMock.mockResolvedValueOnce({
      data: {
        success: true,
        referenceId: "HPG-B-OK0001",
        queued: { notification: true, acknowledgement: true },
      },
      error: null,
    });
    renderPage();
    fillValid();
    fireEvent.click(screen.getByRole("button", { name: /submit board application/i }));
    expect(await screen.findByText(/application received/i)).toBeInTheDocument();
    expect(screen.getByText(/HPG-B-OK0001/)).toBeInTheDocument();
  });

  it("blocks submission and shows validation errors on missing required fields", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /submit board application/i }));
    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it("shows an error banner and stays on the form when internal notification fails", async () => {
    invokeMock.mockResolvedValueOnce({
      data: {
        success: false,
        referenceId: "HPG-B-NOTIFX",
        error:
          "Your application was saved but the internal notification could not be queued. Our Nominations Committee will follow up.",
        queued: { notification: false, acknowledgement: true },
      },
      error: null,
    });
    renderPage();
    fillValid();
    fireEvent.click(screen.getByRole("button", { name: /submit board application/i }));
    const alerts = await screen.findAllByRole("alert");
    expect(
      alerts.some((n) => /internal notification could not be queued/i.test(n.textContent || ""))
    ).toBe(true);
    expect(screen.queryByText(/application received/i)).not.toBeInTheDocument();
  });

  it("shows an error banner when the acknowledgement email cannot be queued", async () => {
    invokeMock.mockResolvedValueOnce({
      data: {
        success: false,
        referenceId: "HPG-B-ACKX01",
        error:
          "Your application was saved but the acknowledgement email could not be queued. Please save your reference number.",
        queued: { notification: true, acknowledgement: false },
      },
      error: null,
    });
    renderPage();
    fillValid();
    fireEvent.click(screen.getByRole("button", { name: /submit board application/i }));
    const alerts = await screen.findAllByRole("alert");
    expect(
      alerts.some((n) => /acknowledgement email could not be queued/i.test(n.textContent || ""))
    ).toBe(true);
  });

  it("treats an idempotent duplicate response as success", async () => {
    invokeMock.mockResolvedValueOnce({
      data: {
        success: true,
        referenceId: "HPG-B-DUPE01",
        duplicate: true,
        queued: { notification: true, acknowledgement: true },
      },
      error: null,
    });
    renderPage();
    fillValid();
    fireEvent.click(screen.getByRole("button", { name: /submit board application/i }));
    expect(await screen.findByText(/application received/i)).toBeInTheDocument();
    expect(screen.getByText(/HPG-B-DUPE01/)).toBeInTheDocument();
  });

  it("keeps the same idempotency key across retries in one session", async () => {
    invokeMock.mockResolvedValueOnce({ data: { success: false, error: "Network blip" }, error: null });
    invokeMock.mockResolvedValueOnce({
      data: {
        success: true,
        referenceId: "HPG-B-RETRY",
        queued: { notification: true, acknowledgement: true },
      },
      error: null,
    });
    renderPage();
    fillValid();
    fireEvent.click(screen.getByRole("button", { name: /submit board application/i }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole("button", { name: /submit board application/i }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalledTimes(2));
    const k1 = (invokeMock.mock.calls[0][1] as { body: { idempotencyKey: string } }).body.idempotencyKey;
    const k2 = (invokeMock.mock.calls[1][1] as { body: { idempotencyKey: string } }).body.idempotencyKey;
    expect(k1).toBe(k2);
  });
});
