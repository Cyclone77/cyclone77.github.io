/**
 * 主函数：自动管理 Issue 标签
 * 1. 当 Issue 打开时，如果没有状态标签，自动添加“状态:草稿”。
 * 2. 当添加新的状态标签时，自动移除旧的状态标签，确保只有一个状态标签。
 */
module.exports = async ({ github, context, core }) => {
    const action = context.payload.action;
    const issue = context.payload.issue;

    if (action === 'opened') {
        const labels = issue.labels.map(label => label.name);
        const hasStatusLabel = labels.some(label => label.startsWith('状态:'));

        if (!hasStatusLabel) {
            await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issue.number,
                labels: ['状态:草稿'],
            });
            console.log('已自动添加"状态:草稿"标签');
        }
    } else if (action === 'labeled') {
        const newLabel = context.payload.label.name;

        // 如果添加的是状态标签
        if (newLabel.startsWith('状态:')) {
            const labels = issue.labels.map(label => label.name);

            // 找出其他状态标签
            const otherStatusLabels = labels.filter(label => label.startsWith('状态:') && label !== newLabel);

            // 移除其他状态标签
            for (const label of otherStatusLabels) {
                try {
                    await github.rest.issues.removeLabel({
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        issue_number: issue.number,
                        name: label,
                    });
                    console.log(`已移除标签: ${label}`);
                } catch (e) {
                    console.log(`移除标签 ${label} 失败（可能已被移除）: ${e.message}`);
                }
            }

            console.log(`保留唯一状态标签: ${newLabel}`);
        }
    }
};
