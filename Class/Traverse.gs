function testTraverse() {
  //your object
  var object = {
    foo: "fooの中身",
    arr: [1, 2, 3],
    subo: {
      foo2: "sudo.foo2の中身",
      foo: "sudo.fooの中身"
    },
    human: {
      foo: {
        foo: {
          foo: "ネストしても大丈夫",
          name: "スズキ"
        }
      }
    }
  };
  //オブジェクトの中に自分自身を参照するような形でも無限ループを起こしません｡
  object.object = object;

  console.log(object);
  const traverse = new Traverse(object)
  console.log(traverse.find("object"))
  //無限ループは起きない

  console.log(traverse.find("foo"))
  //-> fooは複数存在するので､該当するものが配列で戻ってきます｡


  console.log(traverse.find("foo").find("name").object)
  //メソッドチェーンでつなげることも可能です｡foo のあとにkeyがnameのものがあるものを探します｡
  //-> [ 'スズキ' ]

  //存在しない keyを渡してみる｡
  console.log(traverse.find("hogehogehoge").find("name"))
  //-> []

}

/**
 * Note: 元ネタ
 * https://stackoverflow.com/questions/722668/traverse-all-the-nodes-of-a-json-object-tree-with-javascript?answertab=modifieddesc#tab-top
 */
class Traverse {
  /**
   * @constructor
   * @param {object} - object 検索対象のオブジェクト
   */
  constructor(object) {
    this.object = object;
  }
  /**
   * @param {object} - object
   * @reuturn {Map}
   * ToDo:中身正直完全には理解していません
   */
  * traverse(object) {
    const memory = new Set();
    function* innerTraversal(object, path = []) {
      if (memory.has(object)) {
        // we've seen this object before don't iterate it
        return;
      }
      // add the new object to our memory.
      memory.add(object);
      for (const i of Object.keys(object)) {
        const itemPath = path.concat(i);
        yield [i, object[i], itemPath, object];
        if (object[i] !== null && typeof (object[i]) == "object") {
          //going one step down in the object tree!!
          yield* innerTraversal(object[i], itemPath);
        }
      }
    }
    yield* innerTraversal(object);
  }
  /**
   * コンストラクタにセットしたオブジェクトの中に key が存在すれば､その中の value を返すメソッド
   * @param {string}
   */
  find(targetKey) {
    let result = []
    for (let [key, value, path, parent] of this.traverse(this.object)) {
      // do something here with each key and value
      if (targetKey === key) {
        result.push(value)
      }
    }
    return new Traverse(result)
  }
  /**
   * インスタンスの値を返すメソッド
   * @param {number} index デフォルトは0
   * @return {any} - value
   */
  getValue(index = 0) {
    const value = this.object[index]
    return value

  }
}









