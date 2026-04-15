// lib/scan.cleanup.ts

export async function enforceOrgScanLimit(orgId: string, keepLatest = 10) {
    const { db } = await import("@snappin/db/index");

    // Get all scans for org sorted by newest first
    const scans = await db.scan
        .find({ orgId })
        .sort({ createdAt: -1 })
        .select("_id")
        .lean();

    if (scans.length <= keepLatest) return;

    // Everything beyond the 10 most recent gets purged
    const toDelete = scans
        .slice(keepLatest)
        .map(s => s._id?.toString())
        .filter((id): id is string => !!id);

    await Promise.all([
        db.scan.deleteMany({ _id: { $in: toDelete } }),
        db.scanChunk.deleteMany({ scanId: { $in: toDelete } }),
        db.scanMessage.deleteMany({ scanId: { $in: toDelete } }),
    ]);
}