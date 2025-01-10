"use client"

import { Textarea } from "@/components/ui/textarea";
import Login from "./auth/Login";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircledIcon, CodeIcon, Share2Icon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import Image from 'next/image';


export default function LoggedOutHome() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const features = [
        {
            title: "In-Browser IDE",
            description: "Code directly in your browser with our powerful, fully-featured integrated development environment.",
            icon: <CodeIcon className="w-6 h-6" />,
        },
        {
            title: "Automated Answer Checking",
            description: "Get instant feedback on your code with our automated answer checking system.",
            icon: <CheckCircledIcon className="w-6 h-6" />,
        },
        {
            title: "Easy Distribution & Saving",
            description: "Effortlessly distribute and save lecture materials for seamless learning experiences.",
            icon: <Share2Icon className="w-6 h-6" />,
        },
    ];
    return (
        <>
            <div className="min-h-screen text-white">
                <header className={`p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
                    }`}>
                    <h1 className={`text-2xl font-bold transition-all duration-300 ${isScrolled ? 'text-emerald-500' : 'text-emerald-400'
                        }`}>
                        Codl
                    </h1>
                    <Login className={`transition-all duration-300 ${isScrolled
                        ? 'text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-gray-900'
                        : 'text-emerald-400 border-emerald-400 hover:bg-emerald-400 hover:text-gray-900'
                        }`} />
                </header>

                <main>
                    <div className="flex flex-col md:flex-row items-center justify-between py-16 px-4 md:px-8 min-h-screen">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                Replit alternative
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 mb-6">
                                For starting coding instantly in the browser
                            </p>
                            <div className="max-w-md">
                                <p className="text-gray-400 mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                                <Button className="bg-emerald-700 hover:bg-emerald-600 text-white">
                                    Visit a Class
                                </Button>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <div className="relative">
                                <Image
                                    src="/demo-codl.gif"
                                    alt="Demo"
                                    width={1000} 
                                    height={300}
                                    className="rounded-lg shadow-2xl"
                                    unoptimized={true}
                                />
                                <div className="absolute inset-0 bg-emerald-700 opacity-20 blur-xl -z-10 rounded-lg"></div>
                            </div>
                        </div>
                    </div>

                    <section className="bg-gray-800 py-16 px-4 md:px-8">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {features.map((feature, index) => (
                                    <Card key={index} className="bg-gray-700 border-gray-600">
                                        <CardHeader>
                                            <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center mb-4">
                                                {feature.icon}
                                            </div>
                                            <CardTitle className="text-xl font-semibold text-white mb-2">{feature.title}</CardTitle>
                                            <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="py-16">

                        <div className="w-full max-w-md mx-auto p-6 rounded-lg bg-gray-800 shadow-lg">
                            <Tabs defaultValue="bug" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="bug" className="text-emerald-500">Report Bug</TabsTrigger>
                                    <TabsTrigger value="feature" className="text-emerald-500">Request Feature</TabsTrigger>
                                </TabsList>
                                <TabsContent value="bug">
                                    <form className="space-y-4">
                                        <Input placeholder="Title" className="bg-gray-700 text-white" />
                                        <Textarea placeholder="Describe the bug" className="bg-gray-700 text-white" />
                                        <Input placeholder="Email (optional)" type="email" className="bg-gray-700 text-white" />

                                        <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-600">Submit Bug Report</Button>
                                    </form>
                                </TabsContent>
                                <TabsContent value="feature">
                                    <form className="space-y-4">
                                        <Input placeholder="Feature title" className="bg-gray-700 text-white" />
                                        <Textarea placeholder="Describe the feature" className="bg-gray-700 text-white" />
                                        <Input placeholder="Email (optional)" type="email" className="bg-gray-700 text-white" />

                                        <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-600">Submit Feature Request</Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </section>

                </main>
            </div>
        </>
    )
}