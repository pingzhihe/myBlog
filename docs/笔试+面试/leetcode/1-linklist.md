数组就是一块连续的内存空间，有了这块内存空间的首地址，就可以通过索引计算出任意位置的元素地址。
链表不一样，链表的元素可以分散在内存空间的任意位置，用每个节点上的`prev`和`next`指针来连接零散的内存块
