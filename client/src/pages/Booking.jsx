import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookSlot } from "@/hooks/useBookSlot";
import { useSlots } from "@/hooks/useSlots";
import { useAvailableDates } from "@/hooks/useAvailableDates ";

const Booking = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState("");

  const { data: datesData } = useAvailableDates(userId, token);

  // 2. Get slots for selected date
  const {
    data: slotsData,
    isLoading: isLinkLoading,
    isError,
    error,
  } = useSlots(userId, selectedDate, token);

  const { mutate, isPending } = useBookSlot();

  if (isError && error?.response?.status === 404) {
    return <div className="text-center mt-10">404 Invalid Link</div>;
  }

  const slots = slotsData?.data?.slots || [];
  const availableDates = datesData?.data?.dates || [];

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-center">Book Appointment</h2>

      {/* DATE PICKER */}
      <div>
        <label className="font-medium">Select Date</label>
        <Input
          type="date"
          min={new Date().toISOString().split("T")[0]} // disable past
          value={selectedDate}
          onChange={(e) => {
            const value = e.target.value;
            if (!availableDates.includes(value)) {
              toast.error("No availability on this date");
              setSelectedDate("");
              return;
            }
            setSelectedDate(value);
          }}
        />
      </div>

      {/* SLOTS */}
      {selectedDate && (
        <div>
          <h3 className="font-medium mb-2">Available Slots</h3>

          {isLinkLoading && <p>Loading...</p>}

          <div className="flex flex-wrap gap-2">
            {!slots.length ? (
              <p>No slots available</p>
            ) : (
              slots?.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedSlot === slot ? "default" : "outline"}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </Button>
              ))
            )}
          </div>
        </div>
      )}

      {/* BOOK BUTTON */}
      {selectedSlot && (
        <Button
          className="w-full"
          disabled={isPending}
          onClick={() =>
            mutate(
              {
                user: userId,
                date: selectedDate,
                slot: selectedSlot,
              },
              {
                onSuccess: () => {
                  toast.success("Slot booked successfully ✅");
                  setSelectedSlot(""); // reset selec
                },
                onError: (err) => {
                  toast.error(err?.response?.data?.message || "Booking failed");
                },
              },
            )
          }
        >
          {isPending ? "Booking..." : "Book Slot"}
        </Button>
      )}
    </div>
  );
};

export default Booking;
