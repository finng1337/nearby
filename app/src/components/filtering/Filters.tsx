import {memo} from "react";
import LocationButton from "@/components/filtering/LocationButton";
import {cx} from "@/utils";

interface Props {
    className?: string;
}
function Filters(props: Props) {
    const {className} = props;

    return (
      <div className={cx({[className as string]: !!className})}>
          <LocationButton />
      </div>
    );
}
export default memo(Filters);