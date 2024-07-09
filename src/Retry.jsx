import React from 'react';

export function Idle() {
    return <p className="status idle">IDLE</p>;
}

export function Trying() {
    return <p className="status trying">TRYING</p>;
}

export function Success() {
  return <p className="status success">SUCCESS</p>;
}

export function Retrying() {
  return <p className="status retrying">RETRYING</p>;
}

export function Filed() {
  return <p className="status failed">FAILED</p>;
}
