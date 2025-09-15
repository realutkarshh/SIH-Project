"use client";

import {
    Users,
    ClipboardList,
    CalendarClock,
    TrendingUp,
    FileText,
    MessageSquare,
} from "lucide-react";

import { CardCarousel, CardCarouselItem } from "@/components/ui/card-carousel";

// path might differ depending on where shadcn put it

const features = [
    {
        icon: Users,
        title: "Role-Based Access",
        desc: "Secure dashboards for admins, teachers, and students with controlled access.",
    },
    {
        icon: ClipboardList,
        title: "QR Based Attendance Management",
        desc: "Generate dynamic QR after every 6 seconds to prevent proxies.",
    },
    {
        icon: CalendarClock,
        title: "Timetable & Scheduling",
        desc: "Generate, manage, and notify timetables seamlessly across departments.",
    },
    {
        icon: FileText,
        title: "Exam & Results",
        desc: "Digitized exam management with instant grade publishing and analytics.",
    },
    {
        icon: TrendingUp,
        title: "Performance Analytics",
        desc: "Insights into student performance, attendance trends, and progress tracking.",
    },
    {
        icon: MessageSquare,
        title: "Announcements & Communication",
        desc: "Send important updates, circulars, and messages directly to users.",
    },
];

const Features = () => {
    return (
        <section id="features" className="text-white px-6 py-24 relative">
            <div className="max-w-6xl mx-auto text-center relative z-[1]">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                    Smart ERP <span className="text-primary">Features</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-14">
                    A powerful and intuitive ERP system to take smart attendance and
                    manage free lectures time efficeinty
                </p>

                <CardCarousel className="max-w-5xl mx-auto">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <CardCarouselItem key={idx} className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-md">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                            </CardCarouselItem>
                        );
                    })}
                </CardCarousel>
            </div>

            <div className="absolute bottom-0 left-1/2 w-[180px] h-[180px] bg-primary opacity-80 blur-[200px] transform -translate-x-1/2 -translate-y-1/2"></div>
        </section>
    );
};

export default Features;
