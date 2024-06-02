import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create Workspace</CardTitle>
          <CardDescription>Create a new workspace with a title and description.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Title of your workspace" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" placeholder="Description" required />
              </div>
            </div>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }
};

export default Modal;
