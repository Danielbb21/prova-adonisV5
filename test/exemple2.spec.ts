import test from 'japa'

test.group('Example 2 ', () => {
  test('assert multi', (assert) => {
    assert.equal(2* 3 , 6)
  })
  test('teste123', (assert)=>{
    assert.equal(1 + 1, 2);
  })
})
