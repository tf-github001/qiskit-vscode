import { expect } from 'chai';
import { Parser } from '../src/qasm/parser'
import { ParserResult, ParseErrorLevel, ParserError } from '../src/qasm/model';

describe('A parser', () => {

  let parser = new Parser();

  describe('with an empty input', () => {
    it('will end without errors', () => {
      let result = parser.parse('');
      expect(result.errors.length).to.be.eq(0);
    });
  });

  describe('with an input with only clean', () => {
    it('will end without errors', () => {
      let result = parser.parse('clean');
      expect(result.errors.length).to.be.eq(0);
    });
  });

  describe('with headers', () => {
    it('defining only ASM version will end without errors', () => {
      let input = 'OPENQASM 2.0;';

      let result = parser.parse(input);
      expect(result.errors.length).to.be.eq(0);
    });

    it('including a functions library will end without errors', () => {
      let input = `
        OPENQASM 2.0;
        include "qelib1.inc";
        `;

      let result = parser.parse(input);
      expect(result.errors.length).to.be.eq(0);
    });
  });

  describe('with sentences', () => {
    it('will accept registers definition', () => {
      let input = `
        qreg q[5];
        creg c[5];
        `;

      let result = parser.parse(input);
      expect(result.errors.length).to.be.eq(0);
    });

    it('will accept gates definition', () => {
      let input = `
        gate u1(lamda) q {
          U(0,0,lambda) q;
        }
        `;

      let result = parser.parse(input);
      expect(result.errors.length).to.be.eq(0);
    });

    it('will not accept gates definition with a barrier', () => {
      let input = `
        gate u1(lamda) q {
          U(0,0,lambda) q;
          barrier q;
        }
        `;

      let result = parser.parse(input);
      // TODO this expectation should be much better > Expect.oneErrorLike
      expect(result.errors.length).to.be.eq(1);
      expect(result.errors[0].line).to.be.eq(3);
    });

    it('will accept a barrier outside a gate definition', () => {
      let input = `
        qreg q[5];
        creg c[5];
        barrier q[1];`;

      let result = parser.parse(input);
      expect(result.errors.length).to.be.eq(0);
    });

    it('will accept opaque definition', () => {
      let input = 'opaque foo(a, b, c) q;';

      let result = parser.parse(input);
      expect(result.errors.length).to.be.eq(0);
    });

    it('will accept expressions', () => {
      let input = `
        gate cx c,t {
          CX c,t; 
        }
        
        qreg q[5];
        creg c[5];
        cx q[1],q[0];
        measure q[1] -> c[1];
        reset q;`;

      let result = parser.parse(input);
      expect(result.errors.length).to.be.eq(0);
    });

    it('will accept conditional expressions', () => {
      let input = `
        qreg q[5];
        if (a == 2)
          barrier q[2];
        `;

      let result = parser.parse(input);
      expect(result.errors.length).to.be.eq(0);
    });
  });

  describe('with an input from QX composer', () => {
    it('will end without errors', () => {
      let input = `
        OPENQASM 2.0;
        include "qelib1.inc";

        qreg q[5];
        creg c[5];
        
        u1(pi) q[0];
        x q[1];
        x q[1];
        cx q[1],q[0];
        measure q[1] -> c[1];`;

      let result = parser.parse(input);
      expect(result.errors.length).to.be.eq(0);
    });
  });

  describe('with a wrong q registry defined', () => {
    it('will throw one error', () => {
      let input = `
        OPENQASM 2.0;
        include "qelib1.inc";

        qreg q;`;

      let result = parser.parse(input);
      // TODO this expectation should be much better > Expect.oneErrorLike
      expect(result.errors.length).to.be.eq(1);
      expect(result.errors[0].line).to.be.eq(4);
    });
  });

  describe('with a semantically wrong  input', () => {
    let input = 'qreg q[3];creg c[3];measure foo[1]->c[1];'

    it('will throw one error', () => {
      let result = parser.parse(input);

      Expect.oneErrorLike({
        message: 'Qubit foo is not previously defined',
        start: 28,
        end: 31,
      }, result.errors);
    });
  });

  describe('generates a duplication error', () => {
    it('if a quatum register uses a previously defined symbol', () => {
      let input = 'qreg q[5];creg c[5];qreg q[5];';

      let result = parser.parse(input);

      Expect.oneErrorLike({
        message: 'There is another declaration with name q',
        start: 25,
        end: 26,
      }, result.errors);
    });

    it('if a classic register uses a previously defined symbol', () => {
      let input = 'qreg q[5];creg q[5];';

      let result = parser.parse(input);

      Expect.oneErrorLike({
        message: 'There is another declaration with name q',
        start: 15,
        end: 16,
      }, result.errors);
    });

    it('if a gate uses a previously defined symbol', () => {
      let input = `qreg cx[5];gate cx c,t {
          CX c,t; 
        }`;

      let result = parser.parse(input);

      Expect.oneErrorLike({
        message: 'There is another declaration with name cx',
        start: 16,
        end: 18
      }, result.errors);
    });

    it('if an opaque uses a previously defined symbol', () => {
      let input = `qreg foo[5];opaque foo(a, b, c) q;`;

      let result = parser.parse(input);

      Expect.oneErrorLike({
        message: 'There is another declaration with name foo',
        start: 19,
        end: 22
      }, result.errors);
    });
  });

  describe('throws a semantic error', () => {
    it('if one register is used beyond its size', () => {
      let input = `qreg foo[5];creg bar[5];measure foo[6] -> bar[4];`;

      let result = parser.parse(input);

      Expect.oneErrorLike({
        message: 'Index out of bound at register foo',
        start: 36,
        end: 37
      }, result.errors);
    });

    it('if expecting a different type of register', () => {
      let input = `creg foo[5];creg bar[5];measure foo -> bar;`;

      let result = parser.parse(input);

      Expect.oneErrorLike({
        message: 'Wrong type at foo, expecting a Qreg',
        start: 32,
        end: 35
      }, result.errors);
    });

    it('if registers sizes are different at measure', () => {
      expect(false).to.be.true;
    });

    it('if a gate is used before its definition', () => {
      expect(false).to.be.true;
    });

    it('if a gate receive more arguments than its definition', () => {
      expect(false).to.be.true;
    });
  });

});

class Expect {

  public static oneErrorLike(error: Error, errors: ParserError[]): void {
    expect(errors).to.be.an('array')
      .with.length(1);
    expect(errors[0]).to.deep.equal({
      message: error.message,
      line: error.line || 0,
      start: error.start,
      end: error.end,
      level: ParseErrorLevel.ERROR
    });
  }

}

interface Error {

  message: string;

  start: number;

  end: number;

  line?: number;

}

