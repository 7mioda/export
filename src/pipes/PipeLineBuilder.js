import { promisify } from 'util';
import { pipeline as pipelineWithCb } from 'stream';

const pipeline = promisify(pipelineWithCb);

class PipeLineBuilder {
  constructor() {
    this.pipes = [];
  }

  add(pipe) {
    this.pipes.push(pipe);
    return this;
  }

  build() {
    return pipeline(...this.pipes);
  }
}

export default PipeLineBuilder;
