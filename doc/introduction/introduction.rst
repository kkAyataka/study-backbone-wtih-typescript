========
はじめに
========

Backbone.jsをTypeScriptで使用する方法を検討する。

JavaScriptのコードをTypeScriptから呼び出すには定義ファイル (\*.d.ts) が必要になる。
Backbone.jsには公式な定義ファイルは存在しない。
そのため、TypeScriptで使用するためには定義ファイルを準備する必要がある。

必要な場合は ``@type`` (https://github.com/DefinitelyTyped/DefinitelyTyped)
を利用すれば良いが、ここでは、以下の理由からそれらの使用は避け、独自に作成する。

- Backbone.jsの機能を全て使用できなくて良い
- 型が緩い場合があり、TypeScriptの特性を生かしきれない場合がある
- 可視性が不必要に大きくなる

Backbone.jsを使用すると言っても、実際にアプリケーションを構築する際は、
Backbone.jsをベースに構築した、専用のUI構築用コンポーネントを使用する事になる。
そのため、Backbone.jsの全ての機能は必要ない。

また、TypeScriptの定義ファイルでアクセス修飾子を設定できる。
Backbone.jsのメソッドは本来publicでありながら、TypeScript上ではprotectedなどにすることができる。
これを利用して不必要にメソッドを公開することが無く、アクセス範囲を適切に管理することができる。


---------------------
Backbone.jsの使用方法
---------------------

Backbone.jsの使用方法として、アクセスの違いによって3種類検討した。

.. list-table:: Backbone.jsの使用方法
   :header-rows: 1

   * - 使用方法
     - 特徴
   * - Backbone.jsのクラスを継承して使用する
     - 汎用性が高く、構造上の課題の発生に対応がしやすい。
       また、Backbone.jsを拡張するライブラリも自然に利用できる。
       ただし継承先にBackbone.jsの機能が公開されるため、推奨されない使い方も行いやすい。
   * - Backbone.jsのクラスをコンポジションで使用する
     - Backbone.jsの機能を実実装とし、Bridgeパターンで実装する。
       Backbone.jsを隠蔽できる。
   * - JavaScriptでブリッジのためのクラスを作成する
     - Backbone.jsはJavaScriptで扱い、TypeScriptから直接扱わない。
       Backbone.jsを隠蔽できる。

技術的な興味もあって上記を検討することにしたが、実際は継承を用いた形を利用することになる。
構造上のリスクも存在するが、構造自体の技術難易度が低く、リスクに関しても、
これらはコーディングガイドラインやコードレビューなどの運用でカバーできる範囲と考える。


-------------
MVC構造の提供
-------------

Backbone.jsをTypeScriptから利用できるようにするだけでなく、TypeScriptで使用する際のMVC構造を提供する。
そのため、アプリケーション構築時は、ViewとViewのためのModelに関して、
Backbone.jsの機能 (クラス) を直接扱うことはない。

TypeScriptを用いる以上は型チェックが有効に働くように構築する。
また、Backbone.js自体では提供されないが、アプリケーション構築に必要な機能を構築して提供する。

- 型チェックが効くように構築する

  - GenericsとUtility Typeを活用する

- アクセス修飾子を使って積極的に隠蔽する
- Viewのコンポーネント化を行えるようにする

  - 合わせてViewの入子構造に対応する

- 問題が出るまでは、処理速度・処理の無駄より、保守性や単純性を優先する
- こだわり過ぎない・無理しすぎない


----------------
その他の基本技術
----------------

その他の基本技術は以下の通り。これらを使用することを前提に、技術構築を行う。

.. list-table:: 使用技術
   :header-rows: 1

   * - 項目
     - 内容
   * - 基本フレームワーク
     - Backbone.js
   * - モジュール機能
     - AMD (RequireJS)
   * - HTMLテンプレート
     - Underscore.js

使用するOSSライブラリは以下の通り。

.. list-table:: ライブラリ
   :header-rows: 1

   * - ライブラリ名
     - バージョン
     - ライセンス
   * - Backbone.js
     - >= 1.4.0
     - MIT
   * - RequireJS
     - >= 2.3.6
     - MIT
   * - text
     - >= 2.0.16
     - MIT
   * - Underscore.js
     - >= 1.9.1
     - MIT
   * - jQuery
     - >= 3.4.1
     - MIT
