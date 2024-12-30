# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.4.0 (2024-12-30)


### Features

* 모듈 초기 구축 ([97e72c6](https://github.com/chltjdrhd777/gitip/commit/97e72c6fbf4b2249aa5dea2653fd631cd1b82430))
* add versioning cli script and refactoring using command library ([6d21e00](https://github.com/chltjdrhd777/gitip/commit/6d21e0086414e71ede99b38531158d205622a51f))
* ask to update already existing pr branch ([21cfe56](https://github.com/chltjdrhd777/gitip/commit/21cfe567ac368ab7e5980d5ce9bd5094f978a5b8))
* clear branch 커맨드 제작 ([ed754cf](https://github.com/chltjdrhd777/gitip/commit/ed754cf6b62006656353452d21b09574e4f202ce))
* create CHANGELOG.md ([c6fc65f](https://github.com/chltjdrhd777/gitip/commit/c6fc65f23b6ab2e4a5ced3c5d2d8e51095312de1))
* default issue template 분리 및 origin repo 이슈 생성 스크립트 제작 ([dc43df3](https://github.com/chltjdrhd777/gitip/commit/dc43df3e5d3383422cf2ee85a8f895c7a72f9d42))
* dist publish script 제작 ([93fa815](https://github.com/chltjdrhd777/gitip/commit/93fa8151c1fe29e241b29bdc880a2b76c3ecb6a8))
* executeCommand 함수 debug parameter 추가 ([aacae69](https://github.com/chltjdrhd777/gitip/commit/aacae697de550a6a756dcc1622c033717dc1b67a))
* gh 인스톨 커맨드 step까지 추가 ([859329d](https://github.com/chltjdrhd777/gitip/commit/859329d7dec345a4c32e5f028d143358814aab46))
* github issue script 로깅 추가 ([5250ca9](https://github.com/chltjdrhd777/gitip/commit/5250ca93b547068216ff68e1b9a9a83cfaddf17d))
* gitip pull request 기능 추가 ([cf8621e](https://github.com/chltjdrhd777/gitip/commit/cf8621e249f8caf3703e4cd0de7d5094108a5564))
* husky 적용 ([ccc3419](https://github.com/chltjdrhd777/gitip/commit/ccc341944cd89ff1e281ed4b350e6e11ab95d9e8))
* issue branch 생성 시 공용 함수로 처리하도록 수정 ([e9bb8e0](https://github.com/chltjdrhd777/gitip/commit/e9bb8e00f39fbc10787cb5eaa3f29eadfcf6163e))
* origin 브랜치 기반 pr 및 clean branch 명령어 생성 ([c926b6d](https://github.com/chltjdrhd777/gitip/commit/c926b6dea2768e1011cc8c96a14f2256c7d11e6a))
* origin 브랜치 기반으로 pr생성하는 스크립트 제작 및 테스트 ([3656d28](https://github.com/chltjdrhd777/gitip/commit/3656d28d3019d3c53731e5d309e2b7d5271befa1))
* pr시에 pr 작성자를 기본 asignee로 적용될 수 있도록 수정 ([36e8c59](https://github.com/chltjdrhd777/gitip/commit/36e8c590016c663d0bda62ffbdd0fb870ea5a06b))
* setupPackage가 README.md도 포함하도록 스크립트 수정 ([7d1d0db](https://github.com/chltjdrhd777/gitip/commit/7d1d0db6aae99998fbb1027d0db45126c229b20f))
* spinner 라이브러리 직접구현 ([8f1dbe9](https://github.com/chltjdrhd777/gitip/commit/8f1dbe92cb15feea913455da9370b21ddc7add92))
* sync 기능 추가 ([ee80c4b](https://github.com/chltjdrhd777/gitip/commit/ee80c4b6f6ed2c8ac64597e2bbb636a5fecb1016))
* sync 명령어 gh 없이 업데이트하도록 수정 ([d612f10](https://github.com/chltjdrhd777/gitip/commit/d612f103359ebded9b1fe8fe431538520f189f8c))


### Bug Fixes

* add space for pr title and emoji ([6e7a444](https://github.com/chltjdrhd777/gitip/commit/6e7a4449eb156dcb78c2bfe3e8f573e350e8905c))
* clean branch 에서 삭제할 내용이 없을 시 로딩이 계속 도는 문제 수정 ([aa17b24](https://github.com/chltjdrhd777/gitip/commit/aa17b2477bbd7e89272fe6c06e2f0fc09a2f1f91))
* create-issue 템플릿 타이틀 생성할 때, 환경변수 유무 체크 추가 ([1d5caa0](https://github.com/chltjdrhd777/gitip/commit/1d5caa0efb628512ad2328c2208fecaf2323b6b2))
* create-issue inquery ESM에 맞는 모듈로 변경 ([dfc5dc0](https://github.com/chltjdrhd777/gitip/commit/dfc5dc0db39fdce40ce06288a6717ec3bb4b804a))
* gitIssue script 오타 수정 ([7bf1f65](https://github.com/chltjdrhd777/gitip/commit/7bf1f65aae180537e08420f87bed0f3b1baa1938))
* minor update ([3c7c044](https://github.com/chltjdrhd777/gitip/commit/3c7c044bada37aa64fd2c92e88986a044659f11c))
* pr객체에서 pr number을 추출하여 asignee 설정하도록 수정 ([69e8404](https://github.com/chltjdrhd777/gitip/commit/69e8404512485817b29dc052f5ee35146dfd5b27))
* rollback pr title with emoji ([3bccba0](https://github.com/chltjdrhd777/gitip/commit/3bccba09b38557756088f2ba4fae211dfd878c9b))
* version update ([4066004](https://github.com/chltjdrhd777/gitip/commit/4066004431de81450b3ff9409441771481276cf0))

## 1.3.0 (2024-12-30)


### Features

* 모듈 초기 구축 ([97e72c6](https://github.com/chltjdrhd777/gitip/commit/97e72c6fbf4b2249aa5dea2653fd631cd1b82430))
* add versioning cli script and refactoring using command library ([6d21e00](https://github.com/chltjdrhd777/gitip/commit/6d21e0086414e71ede99b38531158d205622a51f))
* ask to update already existing pr branch ([21cfe56](https://github.com/chltjdrhd777/gitip/commit/21cfe567ac368ab7e5980d5ce9bd5094f978a5b8))
* clear branch 커맨드 제작 ([ed754cf](https://github.com/chltjdrhd777/gitip/commit/ed754cf6b62006656353452d21b09574e4f202ce))
* create CHANGELOG.md ([c6fc65f](https://github.com/chltjdrhd777/gitip/commit/c6fc65f23b6ab2e4a5ced3c5d2d8e51095312de1))
* default issue template 분리 및 origin repo 이슈 생성 스크립트 제작 ([dc43df3](https://github.com/chltjdrhd777/gitip/commit/dc43df3e5d3383422cf2ee85a8f895c7a72f9d42))
* dist publish script 제작 ([93fa815](https://github.com/chltjdrhd777/gitip/commit/93fa8151c1fe29e241b29bdc880a2b76c3ecb6a8))
* executeCommand 함수 debug parameter 추가 ([aacae69](https://github.com/chltjdrhd777/gitip/commit/aacae697de550a6a756dcc1622c033717dc1b67a))
* gh 인스톨 커맨드 step까지 추가 ([859329d](https://github.com/chltjdrhd777/gitip/commit/859329d7dec345a4c32e5f028d143358814aab46))
* github issue script 로깅 추가 ([5250ca9](https://github.com/chltjdrhd777/gitip/commit/5250ca93b547068216ff68e1b9a9a83cfaddf17d))
* gitip pull request 기능 추가 ([cf8621e](https://github.com/chltjdrhd777/gitip/commit/cf8621e249f8caf3703e4cd0de7d5094108a5564))
* husky 적용 ([ccc3419](https://github.com/chltjdrhd777/gitip/commit/ccc341944cd89ff1e281ed4b350e6e11ab95d9e8))
* issue branch 생성 시 공용 함수로 처리하도록 수정 ([e9bb8e0](https://github.com/chltjdrhd777/gitip/commit/e9bb8e00f39fbc10787cb5eaa3f29eadfcf6163e))
* origin 브랜치 기반 pr 및 clean branch 명령어 생성 ([c926b6d](https://github.com/chltjdrhd777/gitip/commit/c926b6dea2768e1011cc8c96a14f2256c7d11e6a))
* origin 브랜치 기반으로 pr생성하는 스크립트 제작 및 테스트 ([3656d28](https://github.com/chltjdrhd777/gitip/commit/3656d28d3019d3c53731e5d309e2b7d5271befa1))
* pr시에 pr 작성자를 기본 asignee로 적용될 수 있도록 수정 ([36e8c59](https://github.com/chltjdrhd777/gitip/commit/36e8c590016c663d0bda62ffbdd0fb870ea5a06b))
* setupPackage가 README.md도 포함하도록 스크립트 수정 ([7d1d0db](https://github.com/chltjdrhd777/gitip/commit/7d1d0db6aae99998fbb1027d0db45126c229b20f))
* spinner 라이브러리 직접구현 ([8f1dbe9](https://github.com/chltjdrhd777/gitip/commit/8f1dbe92cb15feea913455da9370b21ddc7add92))
* sync 기능 추가 ([ee80c4b](https://github.com/chltjdrhd777/gitip/commit/ee80c4b6f6ed2c8ac64597e2bbb636a5fecb1016))
* sync 명령어 gh 없이 업데이트하도록 수정 ([d612f10](https://github.com/chltjdrhd777/gitip/commit/d612f103359ebded9b1fe8fe431538520f189f8c))


### Bug Fixes

* add space for pr title and emoji ([6e7a444](https://github.com/chltjdrhd777/gitip/commit/6e7a4449eb156dcb78c2bfe3e8f573e350e8905c))
* clean branch 에서 삭제할 내용이 없을 시 로딩이 계속 도는 문제 수정 ([aa17b24](https://github.com/chltjdrhd777/gitip/commit/aa17b2477bbd7e89272fe6c06e2f0fc09a2f1f91))
* create-issue 템플릿 타이틀 생성할 때, 환경변수 유무 체크 추가 ([1d5caa0](https://github.com/chltjdrhd777/gitip/commit/1d5caa0efb628512ad2328c2208fecaf2323b6b2))
* create-issue inquery ESM에 맞는 모듈로 변경 ([dfc5dc0](https://github.com/chltjdrhd777/gitip/commit/dfc5dc0db39fdce40ce06288a6717ec3bb4b804a))
* gitIssue script 오타 수정 ([7bf1f65](https://github.com/chltjdrhd777/gitip/commit/7bf1f65aae180537e08420f87bed0f3b1baa1938))
* minor update ([3c7c044](https://github.com/chltjdrhd777/gitip/commit/3c7c044bada37aa64fd2c92e88986a044659f11c))
* pr객체에서 pr number을 추출하여 asignee 설정하도록 수정 ([69e8404](https://github.com/chltjdrhd777/gitip/commit/69e8404512485817b29dc052f5ee35146dfd5b27))
* rollback pr title with emoji ([3bccba0](https://github.com/chltjdrhd777/gitip/commit/3bccba09b38557756088f2ba4fae211dfd878c9b))
* version update ([4066004](https://github.com/chltjdrhd777/gitip/commit/4066004431de81450b3ff9409441771481276cf0))

## 1.2.0 (2024-12-18)


### Features

* 모듈 초기 구축 ([97e72c6](https://github.com/chltjdrhd777/gitip/commit/97e72c6fbf4b2249aa5dea2653fd631cd1b82430))
* ask to update already existing pr branch ([21cfe56](https://github.com/chltjdrhd777/gitip/commit/21cfe567ac368ab7e5980d5ce9bd5094f978a5b8))
* clear branch 커맨드 제작 ([ed754cf](https://github.com/chltjdrhd777/gitip/commit/ed754cf6b62006656353452d21b09574e4f202ce))
* default issue template 분리 및 origin repo 이슈 생성 스크립트 제작 ([dc43df3](https://github.com/chltjdrhd777/gitip/commit/dc43df3e5d3383422cf2ee85a8f895c7a72f9d42))
* dist publish script 제작 ([93fa815](https://github.com/chltjdrhd777/gitip/commit/93fa8151c1fe29e241b29bdc880a2b76c3ecb6a8))
* executeCommand 함수 debug parameter 추가 ([aacae69](https://github.com/chltjdrhd777/gitip/commit/aacae697de550a6a756dcc1622c033717dc1b67a))
* gh 인스톨 커맨드 step까지 추가 ([859329d](https://github.com/chltjdrhd777/gitip/commit/859329d7dec345a4c32e5f028d143358814aab46))
* github issue script 로깅 추가 ([5250ca9](https://github.com/chltjdrhd777/gitip/commit/5250ca93b547068216ff68e1b9a9a83cfaddf17d))
* gitip pull request 기능 추가 ([cf8621e](https://github.com/chltjdrhd777/gitip/commit/cf8621e249f8caf3703e4cd0de7d5094108a5564))
* husky 적용 ([ccc3419](https://github.com/chltjdrhd777/gitip/commit/ccc341944cd89ff1e281ed4b350e6e11ab95d9e8))
* issue branch 생성 시 공용 함수로 처리하도록 수정 ([e9bb8e0](https://github.com/chltjdrhd777/gitip/commit/e9bb8e00f39fbc10787cb5eaa3f29eadfcf6163e))
* origin 브랜치 기반 pr 및 clean branch 명령어 생성 ([c926b6d](https://github.com/chltjdrhd777/gitip/commit/c926b6dea2768e1011cc8c96a14f2256c7d11e6a))
* origin 브랜치 기반으로 pr생성하는 스크립트 제작 및 테스트 ([3656d28](https://github.com/chltjdrhd777/gitip/commit/3656d28d3019d3c53731e5d309e2b7d5271befa1))
* pr시에 pr 작성자를 기본 asignee로 적용될 수 있도록 수정 ([36e8c59](https://github.com/chltjdrhd777/gitip/commit/36e8c590016c663d0bda62ffbdd0fb870ea5a06b))
* setupPackage가 README.md도 포함하도록 스크립트 수정 ([7d1d0db](https://github.com/chltjdrhd777/gitip/commit/7d1d0db6aae99998fbb1027d0db45126c229b20f))
* spinner 라이브러리 직접구현 ([8f1dbe9](https://github.com/chltjdrhd777/gitip/commit/8f1dbe92cb15feea913455da9370b21ddc7add92))
* sync 기능 추가 ([ee80c4b](https://github.com/chltjdrhd777/gitip/commit/ee80c4b6f6ed2c8ac64597e2bbb636a5fecb1016))
* sync 명령어 gh 없이 업데이트하도록 수정 ([d612f10](https://github.com/chltjdrhd777/gitip/commit/d612f103359ebded9b1fe8fe431538520f189f8c))


### Bug Fixes

* clean branch 에서 삭제할 내용이 없을 시 로딩이 계속 도는 문제 수정 ([aa17b24](https://github.com/chltjdrhd777/gitip/commit/aa17b2477bbd7e89272fe6c06e2f0fc09a2f1f91))
* create-issue 템플릿 타이틀 생성할 때, 환경변수 유무 체크 추가 ([1d5caa0](https://github.com/chltjdrhd777/gitip/commit/1d5caa0efb628512ad2328c2208fecaf2323b6b2))
* create-issue inquery ESM에 맞는 모듈로 변경 ([dfc5dc0](https://github.com/chltjdrhd777/gitip/commit/dfc5dc0db39fdce40ce06288a6717ec3bb4b804a))
* gitIssue script 오타 수정 ([7bf1f65](https://github.com/chltjdrhd777/gitip/commit/7bf1f65aae180537e08420f87bed0f3b1baa1938))
* minor update ([3c7c044](https://github.com/chltjdrhd777/gitip/commit/3c7c044bada37aa64fd2c92e88986a044659f11c))
* pr객체에서 pr number을 추출하여 asignee 설정하도록 수정 ([69e8404](https://github.com/chltjdrhd777/gitip/commit/69e8404512485817b29dc052f5ee35146dfd5b27))
* version update ([4066004](https://github.com/chltjdrhd777/gitip/commit/4066004431de81450b3ff9409441771481276cf0))
