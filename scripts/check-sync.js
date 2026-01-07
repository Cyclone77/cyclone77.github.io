module.exports = async ({ github, context, core }) => {
    const issueNumber = context.payload.issue?.number;
    if (!issueNumber) {
        // 如果是手动触发或 push 触发，默认需要同步
        core.setOutput('should_sync', 'true');
        return;
    }

    const labels = context.payload.issue.labels.map((l) => l.name);
    const action = context.payload.action;
    const labelName = context.payload.label?.name;

    let shouldSync = false;

    if (action === 'edited' && labels.includes('状态:已发布')) {
        shouldSync = true;
    } else if (action === 'labeled' && labelName === '状态:已发布') {
        shouldSync = true;
    } else if (action === 'unlabeled' && labelName === '状态:已发布') {
        shouldSync = true;
    }

    console.log(`Action: ${action}, Issue: #${issueNumber}, Labels: ${labels}, Should Sync: ${shouldSync}`);
    core.setOutput('should_sync', shouldSync ? 'true' : 'false');
};
