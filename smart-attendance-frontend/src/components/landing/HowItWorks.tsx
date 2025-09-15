import { Users, ClipboardCheck, BarChart3 } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20 py-24">
      <div className="rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-2xl backdrop-blur-md bg-white/5 border border-white/10">
        <div className="text-center mb-12">
          <Users className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
            How Smart <span className="text-primary">ERP Works</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Three simple steps to streamline academics and administration.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary to-primary/70 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/40">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-primary">
              Access & Manage
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Role-based dashboards for students, teachers, and admins ensure
              secure access to academic and administrative tools.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary to-primary/70 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/40">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-primary">
              Automate Processes
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Manage attendance, exams, results, timetables, and announcements
              with a few clicks—eliminating paperwork and errors.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary to-primary/70 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/40">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-primary">
              Analyze & Grow
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Get detailed performance analytics and reports to track progress,
              improve decision-making, and ensure institutional growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
