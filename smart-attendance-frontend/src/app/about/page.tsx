import {
  Brain,
  Target,
  Users,
  Lightbulb,
  Zap,
  Shield,
  Rocket,
  CheckCircle,
  TrendingUp,
  Calendar,
  BookOpen,
  Clock,
} from "lucide-react";
import { TextAnimate } from "@/components/magicui/text-animate";
import { NumberTicker } from "@/components/magicui/number-ticker";
import CTA from "@/components/landing/CTA"
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Us | Vidhya AI",
  description:
    "Discover Vidhya AI — your AI-powered memory companion. We help learners with AI-generated study roadmaps, free curated content, personalized reminders, and scientifically-backed retention methods for smarter, faster learning.",
  keywords: [
    "Vidhya AI About Us",
    "AI memory learning",
    "personalized study roadmap",
    "AI reminders",
    "free study content",
    "AI learning assistant",
    "memory retention AI",
    "study smarter AI",
  ],
};

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "Smart Roadmaps",
      description:
        "AI-generated study roadmaps designed to guide you step by step, so you always know what to learn next.",
    },
    {
      icon: BookOpen,
      title: "Free Study Content",
      description:
        "Access curated notes, explanations, and practice material — all free and tailored to your learning needs.",
    },
    {
      icon: Clock,
      title: "Timely Reminders",
      description:
        "Never forget again. Vidhya AI sends reminders at the right time to help you retain concepts effortlessly.",
    },
    {
      icon: TrendingUp,
      title: "Better Retention",
      description:
        "Our spaced repetition and memory-first approach ensures you remember what you learn for the long term.",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Mission",
      description:
        "To make remembering and retaining knowledge effortless through AI-driven roadmaps, reminders, and free content.",
      highlight: "Memory First",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Harnessing AI to create smarter learning systems that adapt to your goals and make studying stress-free.",
      highlight: "Smart Learning",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Empowering learners globally by providing accessible tools that work for students, professionals, and lifelong learners.",
      highlight: "Global Reach",
    },
  ];

  const stats = [
    { number: 2000, label: "Roadmaps Generated", suffix: "+" },
    { number: 98, label: "Retention Rate", suffix: "%" },
    { number: 10000, label: "Reminders Sent", suffix: "+" },
    { number: 30, label: "Countries", suffix: "+" },
  ];

  return (
    <>
      <div className="pt-32 pb-24">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-20 text-center mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 rounded-3xl blur-3xl -z-10"></div>

          <div className="space-y-8">
            <h1>
              <span className="block font-display text-6xl md:text-9xl lg:text-[10rem] font-black text-white mb-6 leading-[0.85] tracking-tight">
                Vidhya <span className="text-primary">AI</span>
              </span>
              <TextAnimate
                animation="blurIn"
                as="span"
                className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 max-w-4xl mx-auto leading-tight"
              >
                Your AI Memory & Learning Companion
              </TextAnimate>
            </h1>

            <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-white/60 font-medium">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                AI Roadmaps
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Free Study Content
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Smart Reminders
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 hover:bg-primary/10 transition-colors">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-3">
                    <NumberTicker value={stat.number} />
                    {stat.suffix}
                  </div>
                  <p className="text-white/60 text-sm md:text-base font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              What Makes Us <span className="text-primary">Unique</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Vidhya AI focuses on memory, making sure you not only learn but
              also remember and recall information when it matters most.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index}>
                <div className="rounded-xl px-6 py-8 shadow-lg backdrop-blur-md bg-white/5 border border-white/10 hover:scale-[1.02] transition-all duration-300 h-full group">
                  <feature.icon className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-bold text-lg mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20">
          <div className="bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border border-primary/15 rounded-3xl p-8 md:p-16 relative overflow-hidden">
            <div className="relative space-y-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 border border-primary/20 rounded-2xl mb-6">
                  <Rocket className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Our <span className="text-primary">Vision</span>
                </h2>

                <p className="text-lg text-center text-white/70 leading-relaxed">
                  "Vidhya" means "knowledge" in Sanskrit — our vision is to make
                  remembering as effortless as learning.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                  <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                    Vidhya AI is built for the learner who wants more than just
                    study notes. With AI-powered roadmaps, free resources, and
                    timely reminders, we help you stay consistent and confident
                    in your learning journey.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    "AI-powered personalized study roadmaps",
                    "Free and accessible study content",
                    "Smart reminders for better retention",
                    "Helping learners worldwide remember better",
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mt-1">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-white/80 text-lg">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Our Core <span className="text-primary">Values</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide Vidhya AI in building tools that make
              learning smarter, simpler, and stress-free.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index}>
                <div className="rounded-xl px-8 py-10 shadow-lg backdrop-blur-md bg-white/5 border border-white/10 hover:scale-[1.02] transition-all duration-300 h-full text-center">
                  <div className="bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    {value.highlight}
                  </span>
                  <h3 className="font-extrabold text-xl mb-4 text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CTA />
      </div>
      <Footer />
    </>
  );
}
