"use client"

import {useState, useEffect} from "react"
import {LineChart as LineChartIcon} from "lucide-react"
import {CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis, ResponsiveContainer, Tooltip} from "recharts"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {format} from "date-fns"
import {ArrowUpIcon, ArrowDownIcon} from "lucide-react"
import {getPatientParameterData} from "@/app/lib/actions/reports" // Adjust path as needed

interface PatientParameterChartDialogProps {
    patientId: number
    parameterId: number
}

export function PatientParameterChartDialog({
                                                patientId,
                                                parameterId
                                            }: PatientParameterChartDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("")
    const [chartData, setChartData] = useState<{
        data: { time: Date; value: string; attention?: boolean }[]
        parameterName: string
        patientName: string
        units?: string
    } | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let messageInterval: NodeJS.Timeout;

        if (isLoading) {
            const loadingMessages = [
                "Gathering patient data...",
                "Analyzing trends...",
                "Preparing visualization...",
                "Crunching the numbers...",
                "Crafting your graph...",
                "Almost there..."
            ];

            let index = 0;
            setLoadingMessage(loadingMessages[0]);

            messageInterval = setInterval(() => {
                index = (index + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[index]);
            }, 1500);
        }

        return () => {
            if (messageInterval) clearInterval(messageInterval);
        };
    }, [isLoading]); // No more reference to `loadingMessages`


    const loadData = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await getPatientParameterData(patientId, parameterId)
            setChartData(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load chart data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (open && !chartData && !isLoading) {
            loadData().then();
        }
    }

    // Process chart data for rendering
    const processedChartData = chartData?.data
        .map(item => {
            // Try to parse the value as a number
            const numValue = parseFloat(item.value)

            // If it's a valid number, include it in the chart data
            if (!isNaN(numValue)) {
                return {
                    time: format(new Date(item.time), "MMM dd, HH:mm"),
                    value: numValue,
                    rawTime: new Date(item.time),
                    originalValue: item.value
                }
            }

            // Skip this item if the value isn't a valid number
            return null
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => a.rawTime.getTime() - b.rawTime.getTime())

    // Calculate trend if data exists
    const hasTrend = processedChartData && processedChartData.length > 1
    const firstValue = hasTrend ? processedChartData[0].value : 0
    const lastValue = hasTrend ? processedChartData[processedChartData.length - 1].value : 0
    const trend = lastValue - firstValue
    const trendPercentage = hasTrend ? ((trend / Math.abs(firstValue)) * 100).toFixed(1) : "0.0"
    const isIncreasing = trend > 0

    // Y-axis domain calculation
    const values = processedChartData?.map(item => item.value) || []
    const minValue = values.length ? Math.min(...values) : 0
    const maxValue = values.length ? Math.max(...values) : 0
    const yDomainPadding = values.length ? (maxValue - minValue) * 0.1 : 0
    const isFlat = minValue === maxValue && values.length > 0
    const adjustedYDomain = isFlat
        ? [minValue * 0.8 || 0, minValue * 1.2 || 10]
        : [Math.max(0, minValue - yDomainPadding), maxValue + yDomainPadding]

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LineChartIcon className="h-4 w-4"/>
                    <span className="sr-only">View parameter chart</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>
                        {chartData ? `${chartData.parameterName} Trend for ${chartData.patientName}` : "Parameter Trend"}
                    </DialogTitle>
                </DialogHeader>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div
                            className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
                        <p className="text-muted-foreground">{loadingMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-destructive/10 p-4 rounded-lg text-center">
                        <p className="text-destructive font-medium">Error loading chart data</p>
                        <p className="text-sm text-muted-foreground mt-1">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={loadData}
                        >
                            Try again
                        </Button>
                    </div>
                )}

                {chartData && !isLoading && !error && (
                    <>
                        {processedChartData && processedChartData.length > 0 ? (
                            <Card className="w-full">
                                <CardContent className="pt-6">
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsLineChart
                                                data={processedChartData}
                                                margin={{top: 20, right: 15, left: 15, bottom: 20}}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                                <XAxis
                                                    dataKey="time"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                />
                                                <YAxis
                                                    domain={adjustedYDomain}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                    label={{
                                                        value: chartData.units,
                                                        angle: -90,
                                                        position: 'insideLeft',
                                                        style: {textAnchor: 'middle', fill: 'var(--muted-foreground)'}
                                                    }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "hsl(var(--card))",
                                                        borderColor: "hsl(var(--border))",
                                                        borderRadius: "0.5rem",
                                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                    labelStyle={{marginBottom: "0.5rem", fontWeight: "bold"}}
                                                    formatter={(value) => [`${value}${chartData.units ? ` ${chartData.units}` : ''}`]}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="hsl(var(--primary))"
                                                    strokeWidth={2}
                                                    dot={{fill: "hsl(var(--primary))", r: 4}}
                                                    activeDot={{r: 6, fill: "hsl(var(--primary))"}}
                                                />
                                            </RechartsLineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-2 text-sm">
                                    {hasTrend && !isFlat && (
                                        <div className="flex gap-2 font-medium leading-none items-center">
                                            {isIncreasing ? "Increasing" : "Decreasing"} by {Math.abs(trend).toFixed(2)} ({Math.abs(parseFloat(trendPercentage))}%)
                                            {isIncreasing ?
                                                <ArrowUpIcon className="h-4 w-4 text-destructive"/> :
                                                <ArrowDownIcon className="h-4 w-4 text-primary"/>
                                            }
                                        </div>
                                    )}
                                    {isFlat && hasTrend && (
                                        <div className="font-medium leading-none">
                                            Stable
                                            at {processedChartData[0].value}{chartData.units ? ` ${chartData.units}` : ''}
                                        </div>
                                    )}
                                    <div className="leading-none text-muted-foreground">
                                        Showing {chartData.parameterName} values over time
                                        ({processedChartData.length} data points)
                                    </div>
                                </CardFooter>
                            </Card>
                        ) : (
                            <div className="text-center py-12 px-4 bg-muted rounded-lg">
                                <p className="text-muted-foreground mb-2">
                                    Cannot display chart for non-numeric values
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    This parameter contains qualitative values that cannot be graphed.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}