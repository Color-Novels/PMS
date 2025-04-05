import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter, DialogClose
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {HelpCircle, Info, ArrowDown} from 'lucide-react';
import {Card, CardContent} from "@/components/ui/card";
import {CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";

export const FeeSystemHelpDialog = () => {
    return (
        <Dialog defaultOpen={true}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <HelpCircle size={16}/>
                    <span>How Fees Work</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary-700 flex items-center gap-2">
                        <Info size={20}/>
                        Understanding the Fee System
                    </DialogTitle>
                    <DialogDescription>
                        Learn how different types of fees and discounts are applied to patient bills
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Fee Application Order */}
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-2">Fee Application Order</h3>
                            <p className="text-gray-700 mb-4">Fees are applied in a specific order based on their
                                precedence:</p>

                            <div className="space-y-2 ml-2">
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <CustomBadge text="#0" color="red" inverse/>
                                    <span className="font-medium text-gray-800">Medicine Fees</span>
                                    <span className="text-sm text-gray-600">— Applied first, based on prescribed medications</span>
                                </div>
                                <ArrowDown className="mx-auto text-gray-400" size={16}/>

                                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-md">
                                    <CustomBadge text="#1" color="red" inverse/>
                                    <span className="font-medium text-purple-800">Procedure Fees</span>
                                    <span className="text-sm text-gray-600">— Applied next, based on procedures performed</span>
                                </div>
                                <ArrowDown className="mx-auto text-gray-400" size={16}/>

                                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                                    <CustomBadge text="#2" color="red" inverse/>
                                    <span className="font-medium text-blue-800">Fixed Fees</span>
                                    <span className="text-sm text-gray-600">— Applied third, flat rate charges</span>
                                </div>
                                <ArrowDown className="mx-auto text-gray-400" size={16}/>

                                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                                    <CustomBadge text="#3" color="red" inverse/>
                                    <span className="font-medium text-green-800">Percentage Fees</span>
                                    <span
                                        className="text-sm text-gray-600">— Applied fourth, based on total bill so far</span>
                                </div>
                                <ArrowDown className="mx-auto text-gray-400" size={16}/>

                                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md">
                                    <CustomBadge text="#4" color="red" inverse/>
                                    <span className="font-medium text-amber-800">Discount Fees</span>
                                    <span className="text-sm text-gray-600">— Applied last, reducing the final bill amount</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fee Types */}
                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-2">Fee Types Explained</h3>

                            <div className="space-y-4">
                                <div className="p-3 border-l-4 border-l-gray-500 bg-gray-50 rounded-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CustomBadge text="auto-added" color="red"/>
                                        <CustomBadge text="non-removable" color="red"/>
                                        <h4 className="font-medium">Medicine Fees</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">Automatically added based on prescribed
                                        medications. These cannot be removed from a patient&#39;s bill.</p>

                                </div>

                                <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50 rounded-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CustomBadge text="selective" color="green"/>
                                        <CustomBadge text="removable" color="green"/>
                                        <h4 className="font-medium">Procedure Fees (LKR)</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">Added based on procedures performed. Can be
                                        selectively applied to each patient and removed if needed.</p>
                                    <p className={'text-sm text-gray-600'}>Eg: Nebulise, Tending Wounds</p>

                                </div>

                                <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50 rounded-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CustomBadge text="auto-added" color="red"/>
                                        <CustomBadge text="removable" color="green"/>
                                        <h4 className="font-medium">Fixed Fees (LKR)</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">Flat rate charges added to each patient&#39;s
                                        bill
                                        regardless of total amount. Can be removed at prescription time.</p>
                                    <p className={'text-sm text-gray-600'}>Doctor Charges, Dispensary charges</p>
                                </div>

                                <div className="p-3 border-l-4 border-l-green-500 bg-green-50 rounded-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CustomBadge text="auto-added" color="red"/>
                                        <CustomBadge text="removable" color="green"/>
                                        <h4 className="font-medium">Percentage Fees (%)</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">Calculated as a percentage of the total bill
                                        amount up to this point. Can be removed at prescription time.</p>
                                    <p className={'text-sm text-gray-600'}>
                                        Eg: Service Charge, VAT, Service Tax
                                    </p>
                                </div>

                                <div className="p-3 border-l-4 border-l-amber-500 bg-amber-50 rounded-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CustomBadge text="selective" color="green"/>
                                        <CustomBadge text="removable" color="green"/>
                                        <h4 className="font-medium">Discount Fees (%)</h4>
                                    </div>
                                    <p className="text-sm text-gray-600">Percentage discounts that reduce the final bill
                                        amount. Can be selectively applied to each patient and stack with other
                                        discounts.</p>
                                    <p className={'text-sm text-gray-600'}>
                                        Eg: Senior Citizen Discount, Staff Discount, Failed visit discount
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Badge Meanings */}
                    <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-2">Understanding Badges</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CustomBadge text="#0" color="red" inverse/>
                                        <span
                                            className="text-sm text-gray-600">Precedence number (order of application)</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CustomBadge text="auto-added" color="red"/>
                                        <span
                                            className="text-sm text-gray-600">Added automatically to all prescriptions</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CustomBadge text="selective" color="green"/>
                                        <span
                                            className="text-sm text-gray-600">Can be selectively applied to patients</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CustomBadge text="removable" color="green"/>
                                        <span
                                            className="text-sm text-gray-600">Can be removed from a prescription</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CustomBadge text="non-removable" color="red"/>
                                        <span
                                            className="text-sm text-gray-600">Cannot be removed from a prescription</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Got it</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};