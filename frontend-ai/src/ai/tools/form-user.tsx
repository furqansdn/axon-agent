import { z } from "zod";
import { createRunnableUI } from "@/utils/server";
import { DynamicStructuredTool } from "@langchain/core/tools";
import UserDataForm from "@/components/prebuild/form-user";

const formUserSchema = z.object({
  fullname: z.string().optional().describe("The name of the user").default(""),
  age: z.number().optional().describe("The age of the user").default(0),
  citizenship: z
    .string()
    .optional()
    .describe("The citizenship of the user")
    .default(""),
  jobtitle: z
    .string()
    .optional()
    .describe("The job title of the user")
    .default(""),
  gender: z
    .enum(["male", "female"])
    .optional()
    .describe("Gender male or female")
    .default("male"),
});

export const formUserTools = new DynamicStructuredTool({
  name: "render_form_user",
  description:
    "A tool to render form input, base on user data input, this form is also used to register new user",
  schema: formUserSchema,
  func: async (input, config) => {
    const stream = await createRunnableUI(
      config,
      <div>Profile Loading ...</div>
    );

    stream.done(<UserDataForm {...input} />);

    return JSON.stringify(input, null);
  },
});
