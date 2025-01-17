import { memo } from "react";
import PropTypes from "prop-types";
const GridContainer = memo(function GridContainer({ name, value }) {
  return (
    <>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-4 flex flex-col gap-1 items-start">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-3xl font-semibold">{value}</div>
      </div>
    </>
  );
});

GridContainer.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
};

export default GridContainer;
