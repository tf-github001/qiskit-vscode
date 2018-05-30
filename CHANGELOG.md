# Changelog

> **Tags:**
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :nail_care:  [Enhancement]
> - :memo:       [Documentation]

## 0.0.2 (2018-05-28)

> Fixes visualization problems at the x-axis.
> Fixed reload behavior when creating q config.

#### :bug: Bug Fix
  * [#100](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/100) Fixed errors when visualizing results with >1 count in get_counts() ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))

### :nail_care: Enhancements
  * [#101](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/101) Auto reload extension after setup QConfig & refactor extension.ts ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))

#### Committers: 1
- Juan Cruz-Benito ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))

## 0.0.1 (2018-05-25)

> Backports for some folks (also other's when we accidently merged PRs from both 6.x/master)
> Lesson learned: just use `master` and backport on another branch.

#### :rocket: New Features 
  * [#93](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/93) Add command to get the status for remote devices ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))
  * [#92](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/92) Parser adaptation to QISKit 0.5 ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))
  * [#77](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/77) QISKit inline documentation ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))
  * [#69](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/69) Visualizing the results of code executions ([Juan-Cruz](https://github.ibm.com/Juan-Cruz) & [Ismael-Faro1](https://github.ibm.com/Ismael-Faro1))
  * [#55](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/55) Run Python code using QISKit and integration of useful commands from QISKit & API ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))
  * [#40](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/40) QISKit errors highlight ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))
  * [#38](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/38) Managing IBM Q Studio dependencies ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))
  * [#10](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/10) ANTLR v4 grammar adaptation. ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))

#### :bug: Bug Fix
  * [#91](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/91) Solving issues with QISKit v0.5 ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))
  * [#80](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/80) Managing properly the OS-dependent paths ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))
  * [#66](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/66) Improving the check for dependencies. Fixes #65 ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))
  * [#50](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/50) Extension packaging phase fix ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))
  * [#45](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/45) Fixed error when executing methods on the left side of an statement ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))

#### :nail_care: Enhancements
  * [#98](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/98) Updating readme gif ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))
  * [#97](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/97) Re-styling charts ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))
  * [#95](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/96) Added a new logo to the extension ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))
  * [#82](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/82) Solving issues with QISKit v0.5 ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))
  * [#76](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/76) Extension size reduction ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))
  * [#61](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/61) Add code owners abdonrod ([abdonrod](https://github.ibm.com/abdonrod))
  * [#55](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/53) Array index out of bound check ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))
  * [#45](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/45) Fixed error when executing methods on the left side of an statement ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))

#### :memo: Documentation
  * [#63](https://github.ibm.com/IBMQuantum/qiskit-studio/pull/63) Readme file for users and VS Code Marketplace ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))

#### Committers: 4
- Yeray Darias ([Yeray-Darias](https://github.ibm.com/Yeray-Darias))
- Juan Cruz-Benito ([Juan-Cruz](https://github.ibm.com/Juan-Cruz))
- Ismael-Faro1 ([Ismael-Faro1](https://github.ibm.com/Ismael-Faro1))
- abdonrod ([abdonrod](https://github.ibm.com/abdonrod))