"use client";
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { CheckCircle } from "lucide-react";

interface UserDataFormProps {
  fullname: string;
  age: number;
  citizenship: string;
  jobtitle: string;
  gender: "male" | "female";
}
const UserDataForm = (props: UserDataFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formUserState, setFormUserState] = useState<UserDataFormProps>({
    ...props,
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Handle form submission here
    console.log("Form submitted");
    setIsSubmitted(true);
  };

  const handleOnChange = (event: any, key: string) => {
    setFormUserState((prevState) => ({
      ...prevState,
      [key]: event.target.value,
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto min-w-[500px]">
      {!isSubmitted ? (
        <>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formUserState.fullname}
                  onChange={(e) => handleOnChange(e, "fullname")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formUserState.age || undefined}
                  onChange={(e) => handleOnChange(e, "age")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizenship">Citizenship</Label>
                <Input
                  id="citizenship"
                  placeholder="Enter your citizenship"
                  value={formUserState.citizenship}
                  onChange={(e) => handleOnChange(e, "citizenship")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="Enter your job title"
                  value={formUserState.jobtitle}
                  onChange={(e) => handleOnChange(e, "jobtitle")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  defaultValue={formUserState.gender}
                  onValueChange={(value: "male" | "female") => {
                    setFormUserState((prevState) => ({
                      ...prevState,
                      gender: value,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </>
      ) : (
        <CardContent>
          <div className="flex items-center justify-center space-x-2 pt-4">
            <CheckCircle size={24} />
            <span>Profile submitted successfully!</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default UserDataForm;
