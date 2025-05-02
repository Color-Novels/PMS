// app/changelog/page.tsx

    import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
    import {Badge} from "@/components/ui/badge"

    // More customer-friendly changelog with clear versioning and update types

    const changelog = [
        {
            version: "1.0.1",
            date: "2025-05-03",
            updates: [
                {type: "Added", description: "Topical medication support with medication type toggle."},
                {type: "Added", description: "Auto-open popover for drug selection for better usability."},
                {type: "Changed", description: "Dose field now optional for topical medications."},
                {type: "Improved", description: "Medication cards now clearly distinguish between topical and standard medications."},
                {type: "Fixed", description: "Button disable logic to work with both topical and standard medication types."},
            ],
        },
        {
            version: "1.0.0",
            date: "2025-04-26",
            updates: [
                {type: "Added", description: "Initial release of the platform."},
            ],
        },
    ]

    export default function ChangelogPage() {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-4xl font-bold text-primary mb-6">Changelog</h1>

                <div className="space-y-8">
                    {changelog.map((release) => (
                        <Card key={release.version} className="bg-secondary text-secondary-foreground">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Version {release.version}</span>
                                    <span className="text-sm text-muted-foreground">{release.date}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {release.updates.map((update, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <Badge
                                            variant="outline"
                                            className="text-primary border-primary rounded-md text-xs"
                                        >
                                            {update.type}
                                        </Badge>
                                        <p className="text-sm">{update.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }