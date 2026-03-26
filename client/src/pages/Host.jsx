import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookingLink } from "@/hooks/useBookingLink";
import { useCreateAvailability } from "@/hooks/useCreateAvailability";
import { useLogout } from "@/hooks/useLogout";
import { createAvailabilitySchema } from "@/validators/availability.validators";
import { toast } from "sonner";

const Host = () => {
  const { mutateAsync, isPending, error } = useCreateAvailability();
  const { data, isLoading } = useBookingLink();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      date: "",
      startTime: "",
      endTime: "",
    },
    validationSchema: createAvailabilitySchema,
    onSubmit: async (values, { resetForm }) => {
      const res = await mutateAsync(values);
      setList((prev) => [...prev, res.data]);
      resetForm();
    },
  });

  if (error && error.response.status === 409) {
    toast.error("Slot Already available");
  }

  const frontendLink = `${window.location.origin}${data?.link}`;

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-2 bg-gray-100">
      <div className="w-full max-w-md flex justify-end">
        <Button
          variant="outline"
          disabled={isLogoutPending}
          onClick={() =>
            logout(undefined, {
              onSuccess: () => navigate("/"),
              onError: () => toast.error("Logout failed"),
            })
          }
        >
          {isLogoutPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Create Availability
        </h2>

        <div>
          <label className="text-sm font-medium">Date</label>
          <Input
            type="date"
            name="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.date || ""}
          />
          {formik.touched.date && formik.errors.date && (
            <p className="text-red-500 text-sm">{formik.errors.date}</p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label className="text-sm font-medium">Start Time</label>
          <Input
            type="time"
            name="startTime"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startTime}
          />
          {formik.touched.startTime && formik.errors.startTime && (
            <p className="text-red-500 text-sm">{formik.errors.startTime}</p>
          )}
        </div>

        {/* End Time */}
        <div>
          <label className="text-sm font-medium">End Time</label>
          <Input
            type="time"
            name="endTime"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.endTime}
          />
          {formik.touched.endTime && formik.errors.endTime && (
            <p className="text-red-500 text-sm">{formik.errors.endTime}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          {isPending ? `Saving Availability...` : `Save Availability`}
        </Button>
      </form>

      <div className="bg-white p-4 rounded-xl shadow w-full max-w-md">
        <h3 className="font-semibold mb-2">Saved Availability</h3>

        {list.length === 0 && <p>No availability added</p>}

        {list.map((item, i) => (
          <div key={i} className="border p-2 rounded mb-2">
            <p>{new Date(item.date).toDateString()}</p>
            <p>
              {item.startTime} - {item.endTime}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow w-full max-w-md text-center">
        <h3 className="font-semibold mb-2">Booking Link</h3>

        <Button
          onClick={() => {
            navigator.clipboard.writeText(frontendLink);
            alert("Copied!");
          }}
        >
          {isLoading ? "Getting link" : "Copy Link"}
        </Button>
      </div>
    </div>
  );
};

export default Host;
