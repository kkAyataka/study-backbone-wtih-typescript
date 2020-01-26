===========
Backbone.js
===========


-------------------------
Backbone.Viewの初期化処理
-------------------------

Baackbone.Viewのコンストラクタ

.. code-block:: javascript

   var View = Backbone.View = function(options) {
       this.cid = _.uniqueId('view');
       this.preinitialize.apply(this, arguments);
       _.extend(this, _.pick(options, viewOptions));
       this._ensureElement();
       this.initialize.apply(this, arguments);
     };

.. list-table:: 解説
   :header-rows: 1

   * - メソッド
     - 内容
   * - ``_ensureElement``
     - - ``this.$el`` を設定する
       - コンストラクタでしか呼ばれない
       - ``this.setElement`` を呼び出しており、このタイミングで ``this.delegateEvents`` も呼び出されている
