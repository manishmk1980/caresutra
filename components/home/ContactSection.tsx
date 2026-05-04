import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
    return (
        <section id="contact" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Have questions or need guidance? Reach out to our team for personalized assistance.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-xl shadow-sm border">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                                    Send us a message
                                </h3>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" placeholder="Your name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Mobile Number</Label>
                                            <Input id="phone" placeholder="+91 98765 43210" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" placeholder="you@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="service">Service Interest</Label>
                                        <select
                                            id="service"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select a service</option>
                                            <option value="insurance">Insurance</option>
                                            <option value="loan">Loan</option>
                                            <option value="health">Health Service</option>
                                            <option value="multiple">Multiple Services</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea id="message" placeholder="Tell us about your requirements..." rows={4} />
                                    </div>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Submit Enquiry
                                    </Button>
                                </form>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                    Contact Information
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <Phone className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Call Us</h4>
                                            <p className="text-gray-600">+91 98765 43210</p>
                                            <p className="text-sm text-gray-500">Mon‑Sat, 9 AM‑7 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <Mail className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Email</h4>
                                            <p className="text-gray-600">info@caresutra.com</p>
                                            <p className="text-sm text-gray-500">We respond within 24 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <MapPin className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Visit Us</h4>
                                            <p className="text-gray-600">Delhi, India</p>
                                            <p className="text-sm text-gray-500">By appointment only</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-600 text-white p-6 rounded-xl">
                                <h4 className="text-xl font-semibold mb-4">Need Immediate Help?</h4>
                                <p className="mb-4">
                                    Call our dedicated support line for urgent queries regarding insurance claims, loan processing, or health service bookings.
                                </p>
                                <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                                    Call Now: +91 98765 43210
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}