import * as yup from "yup";

import { TIME_REGEX } from "@/lib/regex";

export const createAvailabilitySchema = yup.object({
  date: yup.date().required(),

  startTime: yup.string().matches(TIME_REGEX).required(),
  endTime: yup
    .string()
    .required("End time required")
    .test("is-after", "End must be after start", function (value) {
      const { startTime } = this.parent;
      return value > startTime;
    }),
});
