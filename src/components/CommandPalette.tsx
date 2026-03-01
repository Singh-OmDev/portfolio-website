"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import {
    Home,
    TerminalSquare,
    FolderGit2,
    Moon,
    Sun,
    Mail,
    Github,
    Linkedin,
    Command as CommandIcon
} from "lucide-react";

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Toggle the menu when Cmd+K or Ctrl+K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    const toggleTheme = () => {
        document.documentElement.classList.toggle("dark");
    };

    const copyEmail = () => {
        navigator.clipboard.writeText("contact@omsingh.com"); // Replace with actual email later if needed
        alert("Email copied to clipboard!");
    };

    return (
        <>
            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                label="Global Command Menu"
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-start justify-center pt-[15vh] px-4 transition-all duration-300 ease-out"
            >
                <div className="w-full max-w-[640px] bg-white/95 dark:bg-[#1C1C1C]/95 backdrop-blur-3xl border border-white/20 dark:border-white/[0.08] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-sans ring-1 ring-black/5 dark:ring-white/5">

                    <Dialog.Title className="sr-only">Command Palette Menu</Dialog.Title>
                    <Dialog.Description className="sr-only">Search for navigation links and quick actions.</Dialog.Description>

                    <div className="flex items-center px-4 py-2 border-b border-black/5 dark:border-white/5">
                        <CommandIcon size={18} className="text-neutral-500 mr-2" />
                        <Command.Input
                            autoFocus
                            placeholder="Type a command or search..."
                            className="w-full bg-transparent p-3 outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 text-[15px] font-normal"
                        />
                    </div>

                    <Command.List className="max-h-[350px] overflow-y-auto p-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <Command.Empty className="p-8 text-center text-neutral-500 text-sm">
                            No results found.
                        </Command.Empty>

                        <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500 [&_[cmdk-group-heading]]:dark:text-neutral-500">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/"))}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/10 text-neutral-700 dark:text-neutral-200 transition-none font-medium text-[13px] select-none"
                            >
                                <Home size={16} className="text-neutral-500 dark:text-neutral-400" />
                                <span>Home Page</span>
                            </Command.Item>

                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/playground"))}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/10 text-neutral-700 dark:text-neutral-200 transition-none font-medium text-[13px] select-none"
                            >
                                <TerminalSquare size={16} className="text-neutral-500 dark:text-neutral-400" />
                                <span>Backend Playground</span>
                                <span className="ml-auto text-[11px] text-neutral-400 dark:text-neutral-500 font-normal">38 Demos</span>
                            </Command.Item>
                        </Command.Group>

                        <div className="my-1 h-[1px] bg-black/5 dark:bg-white/5 w-full" />

                        <Command.Group heading="Quick Actions" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500 [&_[cmdk-group-heading]]:dark:text-neutral-500">
                            <Command.Item
                                onSelect={() => runCommand(toggleTheme)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/10 text-neutral-700 dark:text-neutral-200 transition-none font-medium text-[13px] select-none"
                            >
                                <Sun size={16} className="text-neutral-500 dark:text-neutral-400" />
                                <span>Toggle Theme</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(copyEmail)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/10 text-neutral-700 dark:text-neutral-200 transition-none font-medium text-[13px] select-none"
                            >
                                <Mail size={16} className="text-neutral-500 dark:text-neutral-400" />
                                <span>Copy Email Address</span>
                                <span className="ml-auto text-[11px] text-neutral-400 dark:text-neutral-500 font-normal">contact@omsingh.com</span>
                            </Command.Item>
                        </Command.Group>

                        <div className="my-1 h-[1px] bg-black/5 dark:bg-white/5 w-full" />

                        <Command.Group heading="Links" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500 [&_[cmdk-group-heading]]:dark:text-neutral-500">
                            <Command.Item
                                onSelect={() => runCommand(() => window.open('https://github.com/omsingh17', '_blank'))}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/10 text-neutral-700 dark:text-neutral-200 transition-none font-medium text-[13px] select-none"
                            >
                                <Github size={16} className="text-neutral-500 dark:text-neutral-400" />
                                <span>GitHub</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => window.open('https://linkedin.com/in/omsingh17', '_blank'))}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-black/5 dark:aria-selected:bg-white/10 text-neutral-700 dark:text-neutral-200 transition-none font-medium text-[13px] select-none"
                            >
                                <Linkedin size={16} className="text-neutral-500 dark:text-neutral-400" />
                                <span>LinkedIn</span>
                            </Command.Item>
                        </Command.Group>

                    </Command.List>

                    <div className="bg-transparent p-3 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-[11px] text-neutral-500 font-medium select-none">
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1"><kbd className="font-sans">↑↓</kbd> to navigate</span>
                            <span className="flex items-center gap-1"><kbd className="font-sans">↵</kbd> to select</span>
                        </div>
                        <span className="flex items-center gap-1"><kbd className="font-sans">esc</kbd> to close</span>
                    </div>

                </div>
            </Command.Dialog>
        </>
    );
}
