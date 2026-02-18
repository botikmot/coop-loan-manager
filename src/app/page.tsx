"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShieldCheck, BarChart3, Wallet, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10 items-center">

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold leading-tight"
            >
              Manage Cooperative Loans
              <span className="text-blue-600 block">Smarter & Faster</span>
            </motion.h1>

            <p className="mt-6 text-lg text-gray-600">
              <span className="font-bold">CoopTrack</span> helps cooperatives track loans, payments, and member balances with ease.
              Save time, reduce errors, and stay financially organized.
            </p>

            <div className="mt-8 flex gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="px-8">Start Free Trial</Button>
              </Link>

              <Link href="/auth/login">
                <Button variant="outline" size="lg">Login</Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              ✔ No credit card required • ✔ Setup in minutes
            </p>
          </div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: .9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 rounded-2xl p-10 shadow-inner"
          >
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow flex justify-between">
                <span>Total Loans</span>
                <strong>₱1,250,000</strong>
              </div>
              <div className="bg-white p-4 rounded-lg shadow flex justify-between">
                <span>Monthly Collection</span>
                <strong>₱145,000</strong>
              </div>
              <div className="bg-white p-4 rounded-lg shadow flex justify-between">
                <span>Active Members</span>
                <strong>182</strong>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Everything You Need to Manage Loans</h2>
          <p className="text-gray-600 mt-3">
            Designed for cooperatives that want efficiency, accuracy, and transparency.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Feature icon={<Wallet />} title="Loan Tracking" text="Monitor loan balances and payments in real time." />
            <Feature icon={<Users />} title="Member Management" text="Keep complete records of cooperative members." />
            <Feature icon={<BarChart3 />} title="Financial Insights" text="Instant reports for smarter financial decisions." />
            <Feature icon={<ShieldCheck />} title="Secure Data" text="Your cooperative data is protected and private." />
            <Feature icon={<CheckCircle />} title="Payment History" text="Track every payment with automatic balance updates." />
            <Feature icon={<Wallet />} title="Easy Collections" text="Simplify collection and reduce manual errors." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Get Started in Minutes</h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
            <Step number="1" title="Create Account" text="Register your cooperative and start your free trial." />
            <Step number="2" title="Add Members & Loans" text="Record members and loan details quickly." />
            <Step number="3" title="Track & Collect Payments" text="Monitor balances and record payments with ease." />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <p className="text-xl italic">
            “CoopTrack helped us eliminate manual errors and save hours every week.
            Our loan management is now simple and transparent.”
          </p>
          <p className="mt-4 font-semibold">— Cooperative Treasurer</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold">Start Managing Loans the Smart Way</h2>
        <p className="text-gray-600 mt-3">
          Join cooperatives improving efficiency with CoopTrack.
        </p>

        <div className="mt-8">
          <Link href="/auth/register">
            <Button size="lg" className="px-10 text-lg">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-10 text-center">
        <p>© {new Date().getFullYear()} CoopTrack. All rights reserved.</p>
      </footer>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Feature({ icon, title, text }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600 mt-2">{text}</p>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Step({ number, title, text }: any) {
  return (
    <div>
      <div className="text-blue-600 font-bold text-2xl">{number}</div>
      <h3 className="font-semibold text-lg mt-2">{title}</h3>
      <p className="text-gray-600 mt-1">{text}</p>
    </div>
  )
}