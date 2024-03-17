export function cx(classes: Record<string, boolean>): string | undefined {
    const classList: string[] = [];

    for (const k in classes) {
        if (classes[k]) {
            classList.push(k);
        }
    }

    if (!classList.length) {
        return undefined;
    }

    return classList.join(" ");
}