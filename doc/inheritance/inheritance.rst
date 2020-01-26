=================================
継承を用いてBackbone.jsを使用する
=================================


----
概要
----

継承を用いたBackbone.jsの使用方法について説明する。

以下のようなTypeScriptコードで実装することができる。

.. code-block:: typescript

   import {BBView} from '../base/bbview';
   import BBVModel from '../base/bbvmodel';
   import templateText from 'text!app/template.template';

   // View用のデータモデル。
   // Backbone.Modelのattributesの型となり、
   // HTMLテンプレートから参照される。
   // テンプレートで使用されるため、基本的にオプショナルにはならない。
   class VModel {
    value: number = 0;
   }

  // Viewクラス
  // BBViewにVmodelを渡して構築する。
   class View extends BBView<VModel> {
     constructor(el: string) {
       super({
         el,
         templateText,
         vmodel: new BBVModel(new VModel())
       });
   }

   // UIイベントの登録。関数で実装する。
   events() {
     return {
       // クロージャーで実装するのを推奨する。
       // 文字列でも実装できし、メモリ効率は文字列の方が良いが、
       // シンプルさを優先する。
       'input #text': (eve: jQuer.Event) => {
         // this.vmodelのvalueメソッドで設定する。
         // Backbone.Modelのsetは使用しない。
         // Partial<T>型になっており、必要な値だけ設定できる。
         this.vmodel.value({
           value: eve.target.value
           }, {silent: true});
       },

       'click #btn': (eve: jQuery.Event) => {
         // this.vmodelのvalueメソッドで取得する。
         // Backbone,Modelのgetは使用しない。
         // 戻り値をT型で返すので、型チェックとコード補完が効く。
         this.vmodel.value().value;
       },
     }
   }
  }


-------
MVC構造
-------

MVCをなす基本構造は次の通り。この図はMVC構造の説明に特化しており、
実際のクラス構造とは異なる。

.. uml::
   :caption: MVCモデル

   hide empty members

   class "HTML/template" as HTML << View >>

   package JavaScript {
     class Backbone::View
     class Backbone::Model
   }

   package TypeScript {
     class BBView << Controller >>
     class BBVModel << Model >>

     class ConcreateView << Controller >>
     class Data << Model >>
     class Logic << Model >>
   }

   Backbone::View <|-d-- BBView
   Backbone::Model <|-r--- BBVModel

   HTML <-- BBView: << render >>
   HTML ..> BBView: << event >>
   HTML ..> BBVModel: << use >>
   BBVModel .r.> BBView: << event >>
   BBVModel <-l- BBView: << update >>
   BBView *--> BBView: -views

   BBView <|-- ConcreateView
   ConcreateView --> Data
   ConcreateView --> Logic

``BBView`` 、``BBVModel`` でMVCの基本構造をなしている。``VModel`` の監視、
HTMLの再描画はこれらの基本クラスが行うため、実装する必要はない。
アプリケーションの実装は ``BBView`` を継承した実Viewクラスを中心に行っていく。

実際のアプリケーション構築時は、**アプリケーション用の基本VModelクラスを用意した方が良い** 。
理由・実装すべき機能については後述する。

Viewクラスに関しては ``BBView`` クラスの機能で大体十分であるが、
全体的に細工を入れるためにアプリケーション用の基本Viewクラスが必要になる場合がある。


--------------
基本クラス構図
--------------

TypeScriptのクラス構造は次に示す通り。

- BBBaseViewは子View化のためにGenerics未使用の基本クラスとして準備
- BBBaseViewに実装して良い要素もあるが、継承での実装を考慮し、
  あえてBBViewのprivate要素として実装しているものがある

.. uml::
   :caption: Class Structure

   hide empty members

   class Backbone::Event
   class Backbone::View
   class Backbone::Model

   class BBBaseView
   class BBView<T> {
     - template
   }
   class BBVModel<T>

   class ConcreateView
   class ConcreateVModel
   class DBModel
   class Logic

   Backbone::Event <|-d- Backbone::View
   Backbone::Event <|-d- Backbone::Model
   Backbone::View -[hidden]r->  Backbone::Model

   Backbone::Model <|-- BBVModel
   Backbone::View <|-- BBBaseView
   BBBaseView <|-- BBView

   BBView -r-> BBVModel: #vmodel
   BBView --> BBBaseView: -views[]

   BBVModel --> ConcreateVModel
   BBView <|-- ConcreateView

   ConcreateView --> DBModel
   ConcreateView --> Logic
