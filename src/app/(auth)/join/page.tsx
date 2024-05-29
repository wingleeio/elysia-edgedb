"use client";

import { FaDiscord, FaGithub } from "react-icons/fa";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { RiArrowRightLine } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
    .object({
        email: z.string().email(),
        password: z
            .string()
            .min(8, {
                message: "Password must be at least 8 characters long",
            })
            .regex(new RegExp('(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*'), {
                message:
                    "Password must contain at least one uppercase letter and one special character",
            }),
        confirmPassword: z.string().min(8, {
            message: "Password must be at least 8 characters long",
        }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "The passwords do not match",
            });
        }
    });

export default function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async ({
        confirmPassword,
        ...data
    }: z.infer<typeof schema>) => {
        setLoading(true);
        const loadingId = toast.loading("Creating your account...", {
            description:
                "Please hold on while our specialized team of space rabbits create your account",
        });
        const { error } = await api.auth.join.post(data);

        if (!error) {
            toast.success("Logged in successfully", {
                description: "We will redirect you to where you left off",
            });
            router.push("/");
            router.refresh();
        }

        if (error) {
            switch (error.status) {
                case 409:
                    toast.error("Unable to create account", {
                        description:
                            "There as an error creating your account. Double check your email and password and try again.",
                    });
                    break;
                default:
                    toast.error("An error occurred. Please try again later.", {
                        description:
                            "The error has been logged and we will investigate it shortly.",
                    });
                    break;
            }
        }

        toast.dismiss(loadingId);
        setLoading(false);
    };

    return (
        <Form {...form}>
            <div className="relative bg-muted rounded-md shadow-lg border border-solid w-[380px] max-w-full">
                <div className="rounded-md p-8 flex flex-col items-center bg-background border-b border-solid">
                    <Link href="/">
                        <img
                            className="h-8 mb-8"
                            src="/logo.svg"
                            alt="my logo"
                        />
                    </Link>
                    <h1 className="font-semibold mb-2">
                        Register for Superstack
                    </h1>
                    <p className="text-muted-foreground text-sm mb-8">
                        Hello! Please register to continue
                    </p>
                    <div className="flex gap-2 w-full mb-4">
                        <Button variant="outline" className="w-full gap-4">
                            <FaGithub className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" className="w-full gap-4">
                            <FaDiscord className="h-5 w-5 fill-[#7289da]" />
                        </Button>
                    </div>
                    <div className="mb-4 w-full flex items-center">
                        <Separator className="flex-1" />
                        <span className="text-muted-foreground text-xs px-2">
                            OR
                        </span>
                        <Separator className="flex-1" />
                    </div>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full mb-4 text-muted-foreground">
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs opacity-80 font-normal" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full mb-4 text-muted-foreground">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs opacity-80 font-normal" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="w-full mb-8 text-muted-foreground">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs opacity-80 font-normal" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full gap-2"
                            disabled={loading}
                        >
                            <span>Continue</span>
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RiArrowRightLine />
                            )}
                        </Button>
                    </form>
                </div>
                <div className="p-4 text-center text-sm">
                    <span className="text-muted-foreground/80">
                        Have an account?{" "}
                    </span>
                    <Link href="/login">Login</Link>
                </div>
            </div>
        </Form>
    );
}
