import {memo} from "react";
import styles from "@/components/TagLabel.module.scss";
import {cx} from "@/utils";

interface Props {
    tag: string;
    className?: string;
}
function TagLabel(props: Props) {
    const {tag, className} = props;
    return (
        <span
            className={cx({
                [styles.tag]: true,
                [className as string]: !!className,
            })}
        >
            {tag}
        </span>
    );
}
export default memo(TagLabel);
