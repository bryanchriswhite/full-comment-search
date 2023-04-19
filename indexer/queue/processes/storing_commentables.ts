export default function(job) {
    console.log("processing pendingCommentables queue");
    const {commentable} = job.data;
    // TODO: Mutate commentables using Postgraphile
}