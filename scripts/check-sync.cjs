module.exports = async ({ github, context, core }) => {
    // 获取 issue number：优先从 context 获取，其次从环境变量获取（workflow_run 场景）
    let issueNumber = context.payload.issue?.number;
    if (!issueNumber && process.env.UPSTREAM_ISSUE_NUMBER) {
        issueNumber = parseInt(process.env.UPSTREAM_ISSUE_NUMBER, 10);
        console.log(`从上游 workflow 获取 Issue Number: #${issueNumber}`);
    }
    
    if (!issueNumber) {
        // 如果是手动触发，默认需要同步（全量）
        console.log('没有 Issue Number，执行全量同步');
        core.setOutput('should_sync', 'true');
        return;
    }

    // 获取 issue 的最新状态
    const { data: issue } = await github.rest.issues.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber
    });
    
    const labels = issue.labels.map((l) => l.name);
    const isPublished = labels.includes('状态:已发布');
    
    console.log(`Issue #${issueNumber} 标签: ${labels.join(', ')}, 是否已发布: ${isPublished}`);
    
    // 只要有 issue number 就需要同步（可能是新增、更新或删除）
    core.setOutput('should_sync', 'true');
};
