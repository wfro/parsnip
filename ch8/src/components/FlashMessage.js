import React from 'react';

export default function FlashMessage(props) {
  return (
    <div className="flash-error">
      {props.message}
    </div>
  );
}

Error.defaultProps = {
  message: 'An error occurred',
};
