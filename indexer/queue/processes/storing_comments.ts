export default function(job) {
    console.log("processing pendingComments queue");
    const {comment} = job.data;
    await addCommentsToDatabase(context.pgClient, [comment]);
}
